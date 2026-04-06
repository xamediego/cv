import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';

import QRCode from 'qrcode'
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {AccountService} from "../../../services/account/account.service";
import {TokenService} from "../../../services/token/token.service";
import {FormInputComponent} from "../../base-form/form-input/form-input.component";
import {SubmitFormComponent} from "../../base-form/submit-form/submit-form.component";
import {NgTemplateOutlet} from "@angular/common";
import {Subject} from "rxjs";
import {ButtonComponent} from "../../button/button.component";

@Component({
  selector: 'app-mfa-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormInputComponent, SubmitFormComponent, NgTemplateOutlet, ButtonComponent],
  templateUrl: './set-mfa-form.component.html',
  styleUrls: ['./set-mfa-form.component.scss']
})
export class SetMfaFormComponent implements OnInit {
  public form: FormGroup;
  public testForm : FormGroup = new FormGroup({});

  public mfaEnabled = false;

  public qrError = '';
  public hasQr = false;

  private qrCodeData = '';
  public processing: boolean = true;

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};
  public formTitle: string = this.mfaEnabled ? "Disable MFA" : "Enable MFA";
  public formDescription: string = !this.hasQr ? "MFA is currently disabled on this account" :
                                    this.mfaEnabled ? "This action will disable MFA on your account" : "This action will enable MFA on your account";

  public submitText: string = this.mfaEnabled ? "Disable" : "Enable";
  public processMessage: string = this.mfaEnabled ? "Disableing MFA" : "Enabling MFA";
  public successTitle: string = "MFA updated"
  public successMessage: string = "MFA has either been enabled or disabled on this account.";

  constructor(
    public router: Router,
    private tokenService: TokenService,
    private accountService: AccountService,
    private crf: ChangeDetectorRef
  ) {
    this.form = new FormGroup({
      password: new FormControl('', Validators.required),
      code: new FormControl('', [Validators.required, Validators.pattern(/^\d{0,6}$/)]),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.checkMfa();
    this.updateCodeValidators();
  }

  private updateCodeValidators(): void {
    const codeControl = this.form.get('code');
    codeControl?.setValidators(this.mfaEnabled ? [Validators.required] : []);
    codeControl?.updateValueAndValidity();
  }

  private async checkMfa(): Promise<void> {
    const result = await this.accountService.mfaEnabled();

    if (result.statusCode === 200) this.mfaEnabled = result.responseBody;
  }

  public async getQRCode(): Promise<void> {
    this.hasQr = true;
    await this.generateSecretKey();
  }

  private async generateSecretKey(): Promise<void> {
    this.processing = true;
    this.processMessage = "Generating Secret";
    const result = await this.tokenService.getTotpSecretKey();
    this.processing = false;

    if (result.statusCode === 200) {
      this.crf.detectChanges();
      this.qrCodeData = result.responseBody;
      this.renderQRCode();
    } else {
      this.qrError = result.statusCode !== 500 ? result.responseBody : "Server Error";
    }
  }

  private renderQRCode(): void {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    // @ts-ignore
    QRCode.toCanvas(canvas, this.qrCodeData, (error) => {
      if (error) console.error('QR code generation error:', error);
    });
  }

  protected updateRequest(): () => Promise<FetchResponse<any>> {
    return async () => {
      const result = this.mfaEnabled ?
        await this.disableMFA() :
        await this.enableMFA();

      if (result.statusCode == 200) await this.checkMfa();

      return result;
    };
  }

  private async enableMFA(): Promise<FetchResponse<string>> {
    this.processMessage = "Enabling MFA";
    const {password, code} = this.form.value;
    return await this.accountService.enableMFA(password, code);
  }

  private async disableMFA(): Promise<FetchResponse<string>> {
    this.processMessage = "Disabling MFA";
    const {password, code} = this.form.value;
    return await this.accountService.disableMFA(password, code);
  }

  public onCodeInputSubmit$ = new Subject<void>();
  public onCodeInput : () => void = () => {
    let code = this.form.get('code')?.value || '';
    this.form.get('code')?.setValue(code, {emitEvent: false});
    if (code.length === 6) this.onCodeInputSubmit$.next();
  }
}
