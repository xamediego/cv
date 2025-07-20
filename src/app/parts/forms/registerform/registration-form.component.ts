import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgTemplateOutlet} from "@angular/common";
import {Router, RouterLink} from '@angular/router';

import {RegisterService} from "../../../services/register/register.service";
import {PasswordValidatorComponent} from "../../password-validator/password-validator.component";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormEmailValidator} from "../../../tools/EmailValidator";
import {PasswordValidator} from "../../../tools/PasswordValidator";

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordValidatorComponent, EventSpinnerDirective, NgTemplateOutlet, RouterLink],
  templateUrl: './registration-form.component.html',
  styleUrls: ['../form.component.scss']
})
export class RegistrationFormComponent {

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
        displayName : ['', [Validators.required, Validators.minLength(2)]],
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
    if (this.registerForm.invalid) {
      this.error = 'Please correct the highlighted fields.';
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, displayName, email, password } = this.registerForm.value;
    this.registering = true;

    try {
      const response = await this.registrationService.register(username, displayName, password, email);
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
