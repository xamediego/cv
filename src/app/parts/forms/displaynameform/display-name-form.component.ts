import {Component} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";

import {MfaFormAbstract} from "../mfa-form.abstract";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {MfaService} from "../../../services/mfa/mfa.service";

@Component({
  selector: 'app-displayname-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './display-name-form.component.html',
  styleUrl: '../form.component.scss'
})
export class DisplayNameFormComponent extends MfaFormAbstract<string>{
  constructor(
    private accountService: AccountService,
    mfaService : MfaService
  ) {
    super(mfaService, new FormGroup({
      password: new FormControl(['', Validators.required]),
      displayName: new FormControl(['', Validators.required]),
    }))
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password, displayName} = this.form.value;
    return async (code?: string) => {
      this.processing = true
      const result = await this.accountService.updateDisplayName(password, displayName, code);
      this.processing = false;
      return result;
    };
  }
}
