import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {MfaService} from "../../../services/mfa/mfa.service";
import {MfaFormAbstract} from "../mfa-form.abstract";
import {FormComponent} from "../form.component";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, EventSpinnerDirective],
  templateUrl: './login-form.component.html',
  styleUrls: ['../form.component.scss']
})
export class LoginFormComponent extends MfaFormAbstract implements FormComponent{

  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  processMessage : string = 'Logging in..';
  updated : boolean = false;

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  constructor(
    private fb: FormBuilder,
    private loginService: AuthenticationService,
    mfaService: MfaService,
  ) {
    super(mfaService);
    this.form = this.fb.group({
      username: ['', Validators.required],
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
      this.errorMessage = response.responseBody.error;
    }
  }

  private onSuccess: () => Promise<void> = async () => {
    this.onFormSuccess();
    this.updated = true;
  }

  private updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {username, password} = this.form.value;
    return async (code?: string) => {
      this.processing = true
      const result = await this.loginService.login(username, password, code);
      this.processing = false;
      return result;
    };
  }
}
