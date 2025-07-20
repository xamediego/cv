import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';

import QRCode from 'qrcode'

import {FormComponent} from "../form.component";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {AccountService} from "../../../services/account/account.service";
import {TokenService} from "../../../services/token/token.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";

@Component({
  selector: 'app-mfa-form',
  standalone: true,
  imports: [NgTemplateOutlet, ReactiveFormsModule, EventSpinnerDirective],
  templateUrl: './mfa-form.component.html',
  styleUrls: ['../form.component.scss']
})
export class MfaFormComponent implements FormComponent, OnInit {
  public processing = false;
  public eventMessage = '';

  @Inject('onFormClosed') public onFormClosed: () => void = () => {};
  @Inject('onFormSuccess') public onFormSuccess: () => void = () => {};

  public mfaEnabled = false;
  public mfaOperationSuccess = false;
  public mfaOperationMessage = '';
  public qrError = '';
  public hasQr = false;
  public mfaError = '';

  public form: FormGroup;
  private qrCodeData = '';

  constructor(
    public router: Router,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private crf : ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required],
      code: ['', Validators.required],
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
    if (result.statusCode === 200) {
      this.mfaEnabled = result.responseBody;
    }
  }

  public async getQRCode(): Promise<void> {
    this.hasQr = true;
    await this.generateSecretKey();
  }

  private async generateSecretKey(): Promise<void> {
    this.processing = true;
    this.eventMessage = "Generating Secret";

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
      else console.log('QR code generated.');
    });
  }

  public async changeMFA(): Promise<void> {
    this.processing = true;
    this.mfaError = "";

    const result = this.mfaEnabled
      ? await this.disableMFA()
      : await this.enableMFA();

    this.processing = false;

    if (result.statusCode === 200) {
      this.mfaOperationSuccess = true;
      this.mfaOperationMessage = result.responseBody;
      this.onFormSuccess();
      await this.checkMfa();
    } else {
      this.mfaError = result.statusCode === 401 ? "Invalid credentials." : "Internal server error.";
    }
  }

  private async enableMFA(): Promise<FetchResponse<string>> {
    this.eventMessage = "Enabling MFA";
    const { password, code } = this.form.value;
    return await this.accountService.enableMFA(password, code);
  }

  private async disableMFA(): Promise<FetchResponse<string>> {
    this.eventMessage = "Disabling MFA";
    const { password, code } = this.form.value;
    return await this.accountService.disableMFA(password, code);
  }

  public hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }
}

