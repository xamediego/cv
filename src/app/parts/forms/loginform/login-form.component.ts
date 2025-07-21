import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {NgTemplateOutlet} from "@angular/common";
import {MfaService} from "../../../services/mfa/mfa.service";
import {MfaFormAbstract} from "../mfa-form.abstract";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, EventSpinnerDirective, NgTemplateOutlet],
  templateUrl: './login-form.component.html',
  styleUrls: ['../form.component.scss']
})
export class LoginFormComponent extends MfaFormAbstract {

  loginForm: FormGroup;
  loggingIn = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: AuthenticationService,
    mfaService: MfaService,
    private router: Router
  ) {
    super(mfaService);
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public async submit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.loginForm.markAllAsTouched();
      return;
    }

    const {username, password} = this.loginForm.value;
    await this.login(username, password);
  }

  public async cancel() {
    await this.router.navigate(['/auth']);
  }

  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) dynamicComponentContainer!: ViewContainerRef;
  private async login(username: string, password: string): Promise<void> {
    this.loggingIn = true;
    const response = await this.loginService.login(username, password, '');
    this.loggingIn = false;

    if (response.statusCode === 200) {
      await this.router.navigate(['/home']);
    } else if (response.statusCode === 409) {
      await this.handleMfa<string>(
        this.dynamicComponentContainer,
        async (code) => await this.loginService.login(username, password, code),
        async () => await this.router.navigate(['/home']),
        (message) => (this.errorMessage = message)
      );
    } else {
      this.loginForm.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody?.error ?? 'Unknown error';
    }
  }
}
