import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {FormInputComponent} from "../form-input/form-input.component";
import {SubmitFormComponent} from "../submit-form/submit-form.component";

@Component({
  selector: 'app-delete-form',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    SubmitFormComponent
  ],
  templateUrl: './delete-form.component.html',
  styleUrl: '../../forms/form.component.scss'
})
export class DeleteFormComponent {
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  public form: FormGroup;

  public formTitle: string = "Delete Account";
  public formDescription: string =
    "Are you sure that you want to delete your account? This will immediately log you\n" +
    "out of your account and you will not be able to login in again.";

  public submitText: string = "Delete";
  public processMessage: string = "Deleting account";

  public successTitle: string = "Account Deleted"
  public successMessage: string = "Your account has been deleted, you will now be redirected to the main page.";

  constructor(private accountService: AccountService) {
    this.form = new FormGroup({password: new FormControl('', Validators.required)})
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password} = this.form.value;
    return async (code?: string) => {
      return await this.accountService.deleteAccount(password, code);
    };
  }
}
