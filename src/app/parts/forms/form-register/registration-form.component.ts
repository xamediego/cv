import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {RegisterService} from "../../../services/register/register.service";
import {FormEmailValidator} from "../../../tools/EmailValidator";
import {PasswordValidator} from "../../../tools/PasswordValidator";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {passwordsMatchValidator} from "../../../tools/FormUtil";
import {FormInputComponent} from "../../base-form/form-input/form-input.component";
import {SubmitFormComponent} from "../../base-form/submit-form/submit-form.component";

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule,FormInputComponent, SubmitFormComponent],
  templateUrl: './registration-form.component.html',
  styleUrls: ['../../forms/form.component.scss']
})
export class RegistrationFormComponent{
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  public form: FormGroup;

  public submitText: string = "Register";
  public processMessage: string = "Registration Complete!";

  public successTitle: string = "Password Updated"
  public successMessage: string =
    "Your account has been registered.\n" +
    "A verification mail has been sent to your account that you can use to\n" +
    "activate your account.\n " +
    "After this you can login to the platform";

  constructor(private registrationService: RegisterService) {
    this.form =
    new FormGroup(
        {
          username: new FormControl('', [Validators.required, Validators.minLength(2)]),
          displayName: new FormControl('', [Validators.required, Validators.minLength(2)]),
          email: new FormControl('', [Validators.required, FormEmailValidator()]),
          password: new FormControl('', [Validators.required, PasswordValidator()]),
          confirmPassword: new FormControl('', [Validators.required]),
        },
        { validators: [passwordsMatchValidator] });
  }

  protected updateRequest(): () => Promise<FetchResponse<string>> {
    const { username, displayName, email, password } = this.form.value;
    return async () => {
      return await this.registrationService.register(username, displayName, password, email);
    };
  }
}
