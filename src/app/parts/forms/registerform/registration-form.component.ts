import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {RegisterService} from "../../../services/register/register.service";
import {PasswordValidatorComponent} from "../../password-validator/password-validator.component";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormEmailValidator} from "../../../tools/EmailValidator";
import {PasswordValidator} from "../../../tools/PasswordValidator";
import {AbstractFormComponent} from "../form.component";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {passwordsMatchValidator} from "../../../tools/FormUtil";

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordValidatorComponent, EventSpinnerDirective],
  templateUrl: './registration-form.component.html',
  styleUrls: ['../form.component.scss']
})
export class RegistrationFormComponent extends AbstractFormComponent<string>{

  constructor(private registrationService: RegisterService) {
    super(
      new FormGroup(
        {
          username: new FormControl('', [Validators.required, Validators.minLength(2)]),
          displayName: new FormControl('', [Validators.required, Validators.minLength(2)]),
          email: new FormControl('', [Validators.required, FormEmailValidator()]),
          password: new FormControl('', [Validators.required, PasswordValidator()]),
          confirmPassword: new FormControl('', [Validators.required]),
        },
        { validators: [passwordsMatchValidator] }
      )
    );
  }

  protected updateRequest(): () => Promise<FetchResponse<string>> {
    const { username, displayName, email, password } = this.form.value;
    return async () => {
      this.processing = true
      const result = await this.registrationService.register(username, displayName, password, email);
      this.processing = false;
      return result;
    };
  }
}
