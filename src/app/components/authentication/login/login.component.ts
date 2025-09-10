import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginFormComponent} from "../../../parts/forms/loginform/login-form.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router : Router) {}

  onLoginClose = async () => {
    await this.router.navigate(['auth']);
  };

  onLoginComplete = async () => {
    await this.router.navigate(['home']);
  };

}
