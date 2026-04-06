import {Component} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonComponent} from "../../button/button.component";
import {AbstractFormComponent} from "../abstract.form";

@Component({
  selector: 'app-form',
  imports: [
    EventSpinnerDirective,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: '../../forms/form.component.scss'
})
export class FormComponent extends AbstractFormComponent{

}
