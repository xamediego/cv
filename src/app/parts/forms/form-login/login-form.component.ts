import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {FormInputComponent} from "../../base-form/form-input/form-input.component";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {SubmitFormComponent} from "../../base-form/submit-form/submit-form.component";

@Component({
  selector: 'app-form-login',
  imports: [
    ReactiveFormsModule,
    SubmitFormComponent,
    FormInputComponent,
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  public form: FormGroup;

  public submitText: string = "Login";
  public processMessage: string = "Logging in";

  public successTitle: string = "Logged in"
  public successMessage: string = "Your are successfully logged in! You can now use features like uploading new mods and commenting";

  constructor(
    private loginService: AuthenticationService
  ) {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {username, password} = this.form.value;

    return async (code?: string) => {
      return await this.loginService.login(username, password, code);
    };
  }
}
