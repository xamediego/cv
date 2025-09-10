import {Component} from '@angular/core';
import {LoginFormComponent} from "../../../parts/forms/loginform/login-form.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    LoginFormComponent
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
