import {Component, Inject, OnInit} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';

import QRCode from 'qrcode'

import {FormComponent} from "../form.component";
import {FetchResponse} from "../../../../../services/generic/entities/FetchResponse";
import {AccountService} from "../../../../../services/account/account.service";
import {TokenService} from "../../../../../services/token/token.service";

@Component({
  selector: 'app-mfa-form',
  imports: [NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './mfa-form.component.html',
  styleUrl: '../form.component.scss'
})
export class MfaFormComponent implements FormComponent, OnInit {

  public processing: boolean = false;

  @Inject('onFormClosed') public onFormClosed: () => void = () => {
  };
  @Inject('onFormSuccess') public onFormSuccess: () => void = () => {
  };

  mfaEnabled: boolean = false;

  qrError: string = '';
  qrCodeData = "";
  hasQr: boolean = false;

  mfaError: string = "";
  form;

  mfaOperationSuccess: boolean = false;
  mfaOperationMessage: string = "";

  constructor(public router: Router, private tokenService: TokenService, private fb: FormBuilder
    , private accountService: AccountService) {
    this.form = this.fb.group({
      password: ['', {validators: [Validators.required]}],
      code: ['', {validators: [Validators.required]}]
    });
  }

  public async ngOnInit(): Promise<void> {
    await this.checkMfa();
    this.setMfaValidation()
  }

  private setMfaValidation() {
    if (this.mfaEnabled) {
      this.form.get('code')?.setValidators([Validators.required]);
    } else {
      this.form.get('code')?.clearValidators();
    }
    this.form.get('code')?.updateValueAndValidity();
  }

  public async checkMfa() {
    const result: FetchResponse<boolean> = await this.accountService.mfaEnabled();
    if (result.statusCode === 200) this.mfaEnabled = result.responseBody;
  }

  public async getQRCode() {
    this.hasQr = true;

    await this.getTotpSecretKey()
  }

  public async getTotpSecretKey() {
    const result = await this.tokenService.getTotpSecretKey();
    if (result.statusCode === 200) {
      this.qrCodeData = result.responseBody;
      this.generateQRCode()
    } else if (result.statusCode !== 500) {
      this.qrError = result.responseBody;
    } else {
      this.qrError = "Server Error";
    }
  }

  public generateQRCode() {
    const qrCanvas = document.getElementById('qr-canvas') as HTMLCanvasElement;

    // @ts-ignore
    QRCode.toCanvas(qrCanvas, this.qrCodeData, (error) => {
      if (error) {
        console.error('Error generating QR code:', error);
      } else {
        console.log('QR code generated successfully.');
      }
    });

    qrCanvas.style.width = '100%';
    qrCanvas.style.height = 'unset';
  }

  public async changeMFA() {
    this.mfaError = "";

    let result: FetchResponse<string>;

    if (this.mfaEnabled) {
      result = await this.disableMFA();
    } else {
      result = await this.setUpMFA();
    }

    if (result.statusCode === 200) {
      this.onFormSuccess();
      this.mfaOperationSuccess = true;
      this.mfaOperationMessage = result.responseBody;
      await this.checkMfa();
    } else if (result.statusCode === 401) {
      this.mfaError = "Invalid credentials."
    } else {
      this.mfaError = "Internal server error."
    }
  }

  public async setUpMFA(): Promise<FetchResponse<string>> {
    const body = {
      password: this.form.value.password as string,
      code: this.form.value.code as string,
      totpSecurityKey: this.qrCodeData as string,
    }

    return await this.accountService.enableMFA(body.password, body.code);
  }

  public async disableMFA(): Promise<FetchResponse<string>> {
    const body = {
      password: this.form.value.password as string,
      code: this.form.value.code as string,
    }

    return await this.accountService.disableMFA(body.password, body.code);
  }
}
