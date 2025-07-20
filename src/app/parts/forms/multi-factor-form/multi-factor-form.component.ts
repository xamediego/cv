import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {EventSpinnerDirective} from "../../event-spinner.directive";

@Component({
  selector: 'app-multi-factor-form',
  templateUrl: './multi-factor-form.component.html',
  imports: [ReactiveFormsModule, EventSpinnerDirective],
  styleUrls: ['../form.component.scss']
})
export class MultiFactorFormComponent {
  @Input() fetchRequest!: (code : string) => Promise<FetchResponse<any>>;
  @Output() afterMfa = new EventEmitter();

  processing: boolean = false;
  errorMessage: string = '';
  form;

  constructor(private fb: FormBuilder) {this.form = this.fb.group({code: ['', {validators: [Validators.required]}]})}

  async onSubmit() {
    this.errorMessage = "";

    if (this.form.status === 'VALID') {
      const code = this.form.value.code;
      this.processing = true;
      // @ts-ignore
      const result =  await this.fetchRequest(code);
      this.processing = false;
      if (result.statusCode === 200) {
        await this.afterSuccess(result);
      } else if (result.statusCode === 500) {
        this.errorMessage = 'Server Error';
      } else {
        this.errorMessage = result.responseBody;
      }
    }
  }
  async afterSuccess(response: FetchResponse<any>) {
    this.afterMfa.emit(response);
  }

  return() {

  }
}
