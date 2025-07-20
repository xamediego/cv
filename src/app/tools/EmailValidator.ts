import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as EmailValidator from 'email-validator';

export function FormEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = !EmailValidator.validate(control.value);

    return forbidden ? { forbiddenPassword: { value: control.value } } : null;
  };
}
