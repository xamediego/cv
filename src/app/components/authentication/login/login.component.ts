import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from "../../../services/login/login.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, EventSpinnerDirective, NgTemplateOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loggingIn : boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';

      this.loginForm.markAllAsTouched();
      return;
    }

    const {username, password} = this.loginForm.value;

    try {
      const response = await this.loginService.login(username, password);
      if (response.statusCode == 200) {
        await this.router.navigate(['/home']);
      } else if (response.statusCode == 401) {
        this.errorMessage = 'Invalid username or password.';
      } else {
        this.errorMessage = response.statusText;
      }
    } catch (err) {
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.loggingIn = false;
    }
  }

  public async cancel() {
    await this.router.navigate(['/auth']);
  }
}
