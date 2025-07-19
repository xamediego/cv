import {Component, Inject} from '@angular/core';
import {EventSpinnerDirective} from "../../../../../parts/event-spinner.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../../../services/account/account.service";
import {FormComponent} from "../form.component";

@Component({
  selector: 'app-password-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './password-form.component.html',
  styleUrl: '../form.component.scss'
})
export class PasswordFormComponent implements FormComponent{
  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing: boolean = false;
  updated: boolean = false;

  @Inject('onFormClosed') public onFormClosed: () => void = () => {};
  @Inject('onFormSuccess') public onFormSuccess: () => void = () => {};

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
  ) {

    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    const {currentPassword, newPassword} = this.form.value;

    await this.updateDisplayName(currentPassword, newPassword)
  }

  private async updateDisplayName(password: string, newPassword: string) {
    this.processing = true;
    const response = await this.accountService.updatePassword(password, newPassword);
    this.processing = false;

    if (response.statusCode == 200) {
      this.onFormSuccess();
      this.updated = true;
    } else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody;
    }
  }
}
