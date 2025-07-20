import {Component, Inject} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {FormComponent} from "../form.component";

@Component({
  selector: 'app-email-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './email-form.component.html',
  styleUrl: '../form.component.scss'
})
export class EmailFormComponent implements FormComponent{
  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  updated : boolean = false;

  @Inject('onFormClosed') public onFormClosed: () => void = () => {};
  @Inject('onFormSuccess') public onFormSuccess: () => void = () => {};

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
  ) {

    this.form = this.fb.group({
      password: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    const {password, email} = this.form.value;

    await this.updateEmail(password, email)
  }

  private async updateEmail(password : string, email : string){
    this.processing = true;
    const response = await this.accountService.updateEmail(password, email);
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
