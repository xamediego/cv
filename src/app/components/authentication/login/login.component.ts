import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginFormComponent} from "../../../parts/forms/loginform/login-form.component";

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {}
