import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {MfaService} from "../../../services/mfa/mfa.service";
import {MfaFormAbstract} from "../mfa-form.abstract";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, EventSpinnerDirective],
  templateUrl: './login-form.component.html',
  styleUrls: ['../form.component.scss']
})
export class LoginFormComponent extends MfaFormAbstract<string>{
  constructor(
    private loginService: AuthenticationService,
    mfaService: MfaService,
  ) {
    super(mfaService, new FormGroup({
      password: new FormControl(['', Validators.required]),
      displayName: new FormControl(['', Validators.required]),
    }));
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {username, password} = this.form.value;
    return async (code?: string) => {
      this.processing = true
      const result = await this.loginService.login(username, password, code);
      this.processing = false;
      return result;
    };
  }
}
