import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';


import {RegisterService} from "../../../services/register/register.service";
import {FormEmailValidator} from "../tools/EmailValidator";
import {PasswordValidator} from "../tools/PasswordValidator";
import {PasswordValidatorComponent} from "../../../parts/password-validator/password-validator.component";
import {Router, RouterLink} from '@angular/router';
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordValidatorComponent, EventSpinnerDirective, NgTemplateOutlet, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registerForm: FormGroup;
  error: string = '';
  registering: boolean = false;
  registerComplete: boolean = false;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegisterService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, FormEmailValidator()]],
        password: ['', [Validators.required, PasswordValidator()]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [this.passwordsMatchValidator]
      }
    );
  }

  private passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  public async register(): Promise<void> {
    console.log("Submit")

    if (this.registerForm.invalid) {
      this.error = 'Please correct the highlighted fields.';
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registerForm.value;
    this.registering = true;

    try {
      const response = await this.registrationService.register(username, password, email);
      console.log(response)
      if (response.statusCode === 200) {
        this.registerComplete = true;
      } else {
        // @ts-ignore
        this.error = response.responseBody.error;
      }
    } catch (err) {
      this.error = 'An error occurred during registration.';
    } finally {
      this.registering = false;
    }
  }

  public async cancel() {
    await this.router.navigate(['/auth']);
  }
}
