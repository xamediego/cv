import {Component, Input} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {FormInputComponent} from "../form-input/form-input.component";
import {SubmitFormComponent} from "../submit-form/submit-form.component";

@Component({
  selector: 'app-username-form',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    SubmitFormComponent
  ],
  templateUrl: './username-form.component.html',
  styleUrl: '../../forms/form.component.scss'
})
export class UsernameFormComponent {
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  public form: FormGroup;

  public formTitle: string = "Change Username";
  public formDescription: string = "This action will immediately update your username to the changes you've made.";

  public submitText: string = "Update";
  public processMessage: string = "Updating username";

  public successTitle: string = "Username Updated"
  public successMessage: string = "Your username has been successfully updated!";

  constructor(
    private accountService: AccountService
  ) {
    this.form = new FormGroup({
      password: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
    })
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password, username} = this.form.value;
    return async (code?: string) => {
      return await this.accountService.updateUsername(password, username, code);
    };
  }
}
