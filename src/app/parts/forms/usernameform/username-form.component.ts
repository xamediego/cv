import {Component} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {MfaFormAbstract} from "../mfa-form.abstract";
import {MfaService} from "../../../services/mfa/mfa.service";

@Component({
  selector: 'app-username-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './username-form.component.html',
  styleUrl: '../form.component.scss'
})
export class UsernameFormComponent extends MfaFormAbstract<string> {

  constructor(
    private accountService: AccountService,
    mfaService: MfaService,
  ) {
    super(mfaService, new FormGroup({
      password: new FormControl(['', Validators.required]),
      username: new FormControl(['', Validators.required]),
    }))
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password, username} = this.form.value;
    return async (code?: string) => {
      this.processing = true;
      const result = await this.accountService.updateUsername(password, username, code);
      this.processing = false;
      return result;
    };
  }
}
