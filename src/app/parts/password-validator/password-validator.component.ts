import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-password-validator',
  templateUrl: './password-validator.component.html',
  imports: [
    NgClass
  ],
  styleUrl: './password-validator.component.scss'
})
export class PasswordValidatorComponent implements OnChanges {

  @Input('password') passwordValue: string | undefined | null = "";

  eightLength: boolean = false;
  oneDigit: boolean = false;
  oneLowercase: boolean = false;
  oneUppercase: boolean = false;
  oneNonAlphanumeric: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['passwordValue'].currentValue != undefined) {
      const passwordValue: any = changes['passwordValue'].currentValue;

      this.validate(passwordValue);
    }
  }

  private validate(password: string) {
    this.eightLength = password.length >= 8;
    this.oneDigit = /\d/.test(password);
    this.oneLowercase = /[a-z]/.test(password);
    this.oneUppercase = /[A-Z]/.test(password);

    //using w doesnt work for some reason
    this.oneNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);
  }
}
