import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../../../services/account/account.service";
import {EventSpinnerDirective} from "../../../../../parts/event-spinner.directive";
import {UserService} from "../../../../../services/generic/user.service";
import {FormComponent} from "../form.component";

@Component({
  selector: 'app-delete-form',
  imports: [
    ReactiveFormsModule,
    EventSpinnerDirective
  ],
  templateUrl: './delete-form.component.html',
  styleUrl: '../form.component.scss'
})
export class DeleteFormComponent implements FormComponent{

  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  updated : boolean = false;

  @Inject('onFormClosed') public onFormClosed: () => void = () => {};
  @Inject('onFormSuccess') public onFormSuccess: () => void = () => {};

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService : UserService
  ) {

    this.form = this.fb.group({
      password: ['', Validators.required]
    });
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    const {password} = this.form.value;

    await this.deleteAccount(password)
  }

  private async deleteAccount(password : string){
    this.processing = true;
    const response = await this.accountService.deleteAccount(password);
    this.processing = false;

    if (response.statusCode == 200) {
      this.onFormSuccess();
      this.updated = true;
      this.userService.removeJwtToken();
      location.href = "/home";
    } else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody;
    }
  }
}
