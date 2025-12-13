import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {PasswordValidatorComponent} from "../../password-validator/password-validator.component";
import {MfaService} from "../../../services/mfa/mfa.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {MfaFormAbstract} from "../mfa-form.abstract";

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordValidatorComponent,
    EventSpinnerDirective,
  ],
  templateUrl: './password-form.component.html',
  styleUrl: '../form.component.scss'
})
export class PasswordFormComponent extends MfaFormAbstract<string>{
  constructor(
    private accountService: AccountService,
    mfaService: MfaService
  ) {
    super(mfaService, new FormGroup({
      currentPassword: new FormControl(['', Validators.required]),
      newPassword: new FormControl(['', Validators.required]),
      confirmPassword: new FormControl(['', Validators.required]),
    }));
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {currentPassword, newPassword} = this.form.value;
    return async (code?: string) => {
      this.processing = true;
      const result = await this.accountService.updatePassword(currentPassword, newPassword, code);
      this.processing = false;
      return result;
    };
  }
}
