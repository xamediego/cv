import {Component, Inject} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {EventSpinnerDirective} from "../../../../../parts/event-spinner.directive";
import {FormComponent} from "../form.component";

@Component({
  selector: 'app-mfa-form',
  imports: [
    ReactiveFormsModule,
    EventSpinnerDirective
  ],
  templateUrl: './mfa-form.component.html',
  styleUrl: '../form.component.scss'
})
export class MfaFormComponent implements FormComponent {

  public processing: boolean = false;

  @Inject('onFormClosed') public onFormClosed: () => void = () => {};
  @Inject('onFormSuccess') public onFormSuccess: () => void = () => {};
}
