import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {FormInputComponent} from "../../base-form/form-input/form-input.component";
import {SubmitFormComponent} from "../../base-form/submit-form/submit-form.component";
import {Subject} from "rxjs";

@Component({
  selector: 'app-form-mfa-validate',
  templateUrl: './multi-factor-form.component.html',
  imports: [ReactiveFormsModule, FormInputComponent, SubmitFormComponent],
  styleUrls: ['./multi-factor-form.component.scss']
})
export class MultiFactorFormComponent {
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  @Input() public fetchRequest!: (code: string) => Promise<FetchResponse<any>>;
  @Output() public afterMfaEvent = new EventEmitter();

  public form: FormGroup;

  public formTitle: string = "Enter MFA Code";
  public formDescription: string = "Please insert a verification code from your authenticator.";

  public submitText: string = "Confirm";
  public processMessage: string = "Validating code";

  public successTitle: string = "MFA Code validated"
  public successMessage: string = "MFA code has been successfully validated";

  constructor() {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern(/^\d{0,6}$/)])
    });
  }

  public onCodeInputSubmit$ = new Subject<void>();
  public onCodeInput : () => void = () => {
    let code = this.form.get('code')?.value || '';
    this.form.get('code')?.setValue(code, {emitEvent: false});
    if (code.length === 6) this.onCodeInputSubmit$.next();
  }

  protected updateRequest(): () => Promise<FetchResponse<any>> {
    const code = this.form.value.code;
    return async () => {
      const result = await this.fetchRequest(code);
      if(result.statusCode == 200) this.afterMfaEvent.emit(result);
      return result;
    };
  }
}
