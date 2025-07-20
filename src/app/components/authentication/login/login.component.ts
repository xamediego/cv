import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {NgTemplateOutlet} from "@angular/common";
import {MfaService} from "../../../services/mfa/mfa.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, EventSpinnerDirective, NgTemplateOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  loggingIn = false;
  errorMessage = '';
  mfaCheck = false;

  constructor(
    private fb: FormBuilder,
    private loginService: AuthenticationService,
    private mfaService: MfaService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) dynamicComponentContainer!: ViewContainerRef;
  public async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    await this.login(username, password);
  }

  public async cancel() {
    await this.router.navigate(['/auth']);
  }

  private async login(username: string, password: string): Promise<void> {
    const loginResponse = await this.tryLogin(username, password, '');



    if (loginResponse.statusCode === 200) {
      await this.router.navigate(['/home']);
    } else if (loginResponse.statusCode == 409) {
      this.mfaCheck = true;
      const mfaFetch = async (code: string): Promise<FetchResponse<string>> => {
        return await this.tryLogin(username, password, code);
      };
      try {
        console.log(this.dynamicComponentContainer)
        const mfaResponse = await this.mfaService.openMfaScreen<string>(mfaFetch, this.dynamicComponentContainer);
        if (mfaResponse.statusCode === 200) {
          await this.router.navigate(['/home']);
        } else {
          this.errorMessage = mfaResponse.responseBody;
        }
      } catch (err) {
        this.errorMessage = 'MFA failed. Please try again.';
      }
    } else {
      this.loginForm.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = loginResponse.responseBody?.error ?? 'Unknown error';
    }
  }

  private async tryLogin(username: string, password: string, code: string): Promise<FetchResponse<string>> {
    this.loggingIn = true;
    try {
      return await this.loginService.login(username, password, code);
    } finally {
      this.loggingIn = false;
    }
  }
}
