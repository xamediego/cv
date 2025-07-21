import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {UserService} from "../../../services/generic/user.service";
import {FormComponent} from "../form.component";
import {MfaFormAbstract} from "../mfa-form.abstract";
import {MfaService} from "../../../services/mfa/mfa.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-delete-form',
  imports: [
    ReactiveFormsModule,
    EventSpinnerDirective
  ],
  templateUrl: './delete-form.component.html',
  styleUrl: '../form.component.scss'
})
export class DeleteFormComponent extends MfaFormAbstract implements FormComponent{

  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  processMessage : string = 'Deleting Account';
  updated : boolean = false;

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService : UserService,
    mfaService: MfaService
  ) {
    super(mfaService);
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
    this.userService.removeJwtToken();
    location.href = "/home";
  }

  private updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {password} = this.form.value;
    return async (code?: string) => {
      this.processing = true;
      const result = await this.accountService.deleteAccount(password, code);
      this.processing = false;
      return result;
    };
  }
}
