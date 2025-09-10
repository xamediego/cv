import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {MfaFormAbstract} from "../mfa-form.abstract";
import {MfaService} from "../../../services/mfa/mfa.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-email-form',
  imports: [
    EventSpinnerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './email-form.component.html',
  styleUrl: '../form.component.scss'
})
export class EmailFormComponent extends MfaFormAbstract{

  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  updated : boolean = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    mfaService : MfaService
  ) {
    super(mfaService)
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
    await this.processForm<string>(this.updateRequest());
  }

  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) dynamicComponentContainer!: ViewContainerRef;
  private async processForm<T>(fetchRequest: (code?: string) => Promise<FetchResponse<T>>) {
    const response = await fetchRequest();
    if (response.statusCode === 200) {
      await this.onSuccess();
    } else if (response.statusCode === 409) {
      await this.handleMfa<T>(
        this.dynamicComponentContainer,
        async (code) => await fetchRequest(code),
        async () => await this.onSuccess(),
        (message) => (this.errorMessage = message),
        this.processMessage
      );
    } else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody;
    }
  }

  private onSuccess: () => Promise<void> = async () => {
    this.onFormSuccess();
    this.updated = true;
  }

  private updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password, email} = this.form.value;
    return async (code?: string) => {
      this.processing = true
      const result = await this.accountService.updateEmail(password, email, code);
      this.processing = false;
      return result;
    };
  }
}
