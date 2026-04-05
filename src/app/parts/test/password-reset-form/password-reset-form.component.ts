import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {AccountService} from "../../../services/account/account.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {FormInputComponent} from "../form-input/form-input.component";
import {SubmitFormComponent} from "../submit-form/submit-form.component";

@Component({
  selector: 'app-password-reset-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    SubmitFormComponent,
  ],
  templateUrl: './password-reset-form.component.html',
  styleUrl: '../../forms/form.component.scss'
})

export class PasswordResetFormComponent{
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  public form: FormGroup;

  public formTitle: string = "Change Password";
  public formDescription: string = "This action will resend a password reset mail to your email that you will have to\n"
  + "follow to change your password.";

  public submitText: string = "Confirm";
  public processMessage: string = "Changing password";

  public successTitle: string = "Password Updated"
  public successMessage: string = "Your password has been successfully updated!";

  constructor(
    private accountService: AccountService
  ) {
    this.form = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {currentPassword, newPassword} = this.form.value;
    return async (code?: string) => {
      return await this.accountService.updatePassword(currentPassword, newPassword, code);
    };
  }
}
