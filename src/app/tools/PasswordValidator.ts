import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function PasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = !isPasswordValid(control.value);

    function isPasswordValid(password: string): boolean {
      const requiredLength = 8;

      return (
        password.length >= requiredLength &&
        /\d/.test(password) &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        //using w doesnt work for some reason
        /[^a-zA-Z0-9]/.test(password)
      );
    }

    return forbidden ? { forbiddenPassword: { value: control.value } } : null;
  };
}
