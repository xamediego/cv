import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {AccountService} from "../../../services/account/account.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {FormInputComponent} from "../../base-form/form-input/form-input.component";
import {SubmitFormComponent} from "../../base-form/submit-form/submit-form.component";

@Component({
  selector: 'app-form-change-displayname',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    SubmitFormComponent
  ],
  templateUrl: './display-name-form.component.html',
})
export class DisplayNameFormComponent{
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  public form: FormGroup;

  public formTitle: string = "Change Display Name";
  public formDescription: string = "This action will immediately update your display name to the changes you've made.";

  public submitText: string = "Confirm";
  public processMessage: string = "Updating display name";

  public successTitle: string = "Display name Updated"
  public successMessage: string = "Your display name has been successfully updated!";

  constructor(
    private accountService: AccountService,
  ) {
    this.form = new FormGroup({
      password: new FormControl('', Validators.required),
      displayname: new FormControl('', Validators.required),
    });
  }

  protected updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password, displayName} = this.form.value;
    return async (code?: string) => {
      return await this.accountService.updateDisplayName(password, displayName, code);
    };
  }
}
