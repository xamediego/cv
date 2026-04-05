import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {AccountService} from "../../../services/account/account.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {FormInputComponent} from "../form-input/form-input.component";
import {SubmitFormComponent} from "../submit-form/submit-form.component";

@Component({
  selector: 'app-email-form',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    SubmitFormComponent
  ],
  templateUrl: './email-form.component.html',
  styleUrl: '../../forms/form.component.scss'
})
export class EmailFormComponent {
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  public form: FormGroup;

  public formTitle: string = "Change Email";
  public formDescription: string =
    "Upon completing this action a mail will be send to your email that you will have to\n" +
    "follow to confirm your new email account.";

  public submitText: string = "Update";
  public processMessage: string = "Updating email";

  public successTitle: string = "Email Updated"
  public successMessage: string = "A confirmation link has been sent to your new email. Please verify it to complete the update.";

  constructor(
    private accountService: AccountService
  ) {
    this.form = new FormGroup({
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password, email} = this.form.value;
    return async (code?: string) => {
      return await this.accountService.updateEmail(password, email, code);
    };
  }
}
