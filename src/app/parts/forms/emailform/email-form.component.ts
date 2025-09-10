import {Component} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {MfaFormAbstract} from "../mfa-form.abstract";
import {MfaService} from "../../../services/mfa/mfa.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-email-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './email-form.component.html',
  styleUrl: '../form.component.scss'
})
export class EmailFormComponent extends MfaFormAbstract<string>{
  constructor(
    private accountService: AccountService,
    mfaService : MfaService
  ) {
    super(mfaService, new FormGroup({
      password: new FormControl(['', Validators.required]),
      email: new FormControl(['', Validators.required]),
    }))
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password, email} = this.form.value;
    return async (code?: string) => {
      this.processing = true
      const result = await this.accountService.updateEmail(password, email, code);
      this.processing = false;
      return result;
    };
  }
}
