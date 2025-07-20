import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RegistrationFormComponent} from "../../../parts/forms/registerform/registration-form.component";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RegistrationFormComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {}
