import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RegistrationFormComponent} from "../../../parts/test/register-form/registration-form.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RegistrationFormComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  constructor(private router : Router) {}

  onRegisterClose = async () => {
    await this.router.navigate(['auth']);
  };
}
