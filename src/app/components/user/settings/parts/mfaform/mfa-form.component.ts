import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {EventSpinnerDirective} from "../../../../../parts/event-spinner.directive";

@Component({
  selector: 'app-mfa-form',
  imports: [
    ReactiveFormsModule,
    EventSpinnerDirective
  ],
  templateUrl: './mfa-form.component.html',
  styleUrl: '../form.component.scss'
})
export class MfaFormComponent {
    public processing : boolean = false;
}
