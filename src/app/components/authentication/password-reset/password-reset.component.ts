import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {PasswordResetFormComponent} from "../../../parts/forms/form-reset-password/password-reset-form.component";

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    PasswordResetFormComponent
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {

  constructor(private router : Router) {}

  public onResetSuccess: () => void = async () => {
    await this.router.navigate(['login']);
  };

  public onResetClose: () => void = async () => {
   await this.router.navigate(['auth']);
  };

}
