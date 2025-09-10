import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {RegisterService} from "../../../services/register/register.service";
import {PasswordValidatorComponent} from "../../password-validator/password-validator.component";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormEmailValidator} from "../../../tools/EmailValidator";
import {PasswordValidator} from "../../../tools/PasswordValidator";
import {AbstractFormComponent} from "../form.component";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordValidatorComponent, EventSpinnerDirective],
  templateUrl: './registration-form.component.html',
  styleUrls: ['../form.component.scss']
})
export class RegistrationFormComponent extends AbstractFormComponent{

  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  updated : boolean = false;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegisterService) {
    super();
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(2)]],
        displayName : ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, FormEmailValidator()]],
        password: ['', [Validators.required, PasswordValidator()]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [this.passwordsMatchValidator]
      }
    );
  }

  private passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    await this.processForm<string>(this.updateRequest());
  }

  private async processForm<T>(fetchRequest: (code?: string) => Promise<FetchResponse<T>>) {
    const response = await fetchRequest();
    if (response.statusCode === 200) {
      await this.onSuccess();
    }else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody.error;
    }
  }

  private onSuccess: () => Promise<void> = async () => {
    this.onFormSuccess();
    this.updated = true;
  }

  private updateRequest(): () => Promise<FetchResponse<string>> {
    const { username, displayName, email, password } = this.form.value;
    return async () => {
      this.processing = true
      const result = await this.registrationService.register(username, displayName, password, email);
      this.processing = false;
      return result;
    };
  }
}
