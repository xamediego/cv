import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";

import {MfaFormAbstract} from "../mfa-form.abstract";
import {MfaService} from "../../../services/mfa/mfa.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-delete-form',
  imports: [
    ReactiveFormsModule,
    EventSpinnerDirective
  ],
  templateUrl: './delete-form.component.html',
  styleUrl: '../form.component.scss'
})
export class DeleteFormComponent extends MfaFormAbstract<string> {
  constructor(
    private accountService: AccountService,
    mfaService: MfaService
  ) {
    super(mfaService, new FormGroup({
        password: new FormControl(['', Validators.required]),
      })
    );
  }

  // private onSuccess: () => Promise<void> = async () => {
  //   this.onFormSuccess();
  //   this.updated = true;

  //   this.userService.removeJwtToken();
  //   location.href = "/home";
  // }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password} = this.form.value;
    return async (code?: string) => {
      this.processing = true;
      const result = await this.accountService.deleteAccount(password, code);
      this.processing = false;
      return result;
    };
  }
}
