import {Component, inject} from '@angular/core';
import {EventSpinnerDirective} from "../../../../../parts/event-spinner.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AccountService} from "../../../../../services/account/account.service";
import {UserService} from "../../../../../services/generic/user.service";

@Component({
  selector: 'app-displayname-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './displayname-form.component.html',
  styleUrl: '../form.component.scss'
})
export class DisplaynameFormComponent {
  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  updated : boolean = false;

  readonly dialogRef = inject(MatDialogRef<DisplaynameFormComponent>);

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService : UserService
  ) {

    this.form = this.fb.group({
      password: ['', Validators.required],
      displayName: ['', Validators.required]
    });
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    const {password, displayName} = this.form.value;

    await this.updateDisplayName(password, displayName)
  }

  public async cancel() {
    if(this.dialogRef){
      this.dialogRef.close();
    }
  }

  private async updateDisplayName(password : string, displayName : string){
    this.processing = true;
    const response = await this.accountService.updateDisplayName(password, displayName);
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
