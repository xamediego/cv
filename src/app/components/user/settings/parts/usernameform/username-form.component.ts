import {Component, inject} from '@angular/core';
import {EventSpinnerDirective} from "../../../../../parts/event-spinner.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AccountService} from "../../../../../services/account/account.service";

@Component({
  selector: 'app-username-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './username-form.component.html',
  styleUrl: '../form.component.scss'
})
export class UsernameFormComponent {
  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  updated : boolean = false;

  readonly dialogRef = inject(MatDialogRef<UsernameFormComponent>);

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
  ) {

    this.form = this.fb.group({
      password: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    const {password, username} = this.form.value;

    await this.updateEmail(password, username)
  }

  public async cancel() {
    if(this.dialogRef){
      this.dialogRef.close();
    }
  }

  private async updateEmail(password : string, username : string){
    this.processing = true;
    const response = await this.accountService.updateUsername(password, username);
    this.processing = false;

    if (response.statusCode == 200) {
      this.updated = true;
    } else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody;
    }
  }
}
