import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../../../services/authentication/authentication.service";
import {Router} from "@angular/router";
import {AccountService} from "../../../../../services/account/account.service";
import {MatDialogRef} from "@angular/material/dialog";
import {EventSpinnerDirective} from "../../../../../parts/event-spinner.directive";
import {UserService} from "../../../../../services/generic/user.service";

@Component({
  selector: 'app-delete-form',
  imports: [
    ReactiveFormsModule,
    EventSpinnerDirective
  ],
  templateUrl: './delete-form.component.html',
  styleUrl: '../form.component.scss'
})
export class DeleteFormComponent {

  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  updated : boolean = false;

  readonly dialogRef = inject(MatDialogRef<DeleteFormComponent>);

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

  public async cancel() {
      if(this.dialogRef){
        this.dialogRef.close();
      }
  }

  private async deleteAccount(password : string){
    this.processing = true;
    const response = await this.accountService.deleteAccount(password);
    this.processing = false;

    if (response.statusCode == 200) {
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
