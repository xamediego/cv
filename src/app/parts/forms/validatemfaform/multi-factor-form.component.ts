import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {EventSpinnerDirective} from "../../event-spinner.directive";

@Component({
  selector: 'app-validate-mfa-form',
  templateUrl: './multi-factor-form.component.html',
  imports: [ReactiveFormsModule, EventSpinnerDirective],
  styleUrls: ['../form.component.scss']
})
export class MultiFactorFormComponent {

  @Input() public fetchRequest!: (code: string) => Promise<FetchResponse<any>>;
  @Output() public afterMfa = new EventEmitter();

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  @Input() public processMessage : string = '';

  public processing: boolean = false;
  public errorMessage: string = '';
  public form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{0,6}$/)]],
    })
  }

  public async onSubmit() {
    this.errorMessage = "";
    await this.processToken();
  }

  private async processToken() {
    if (this.form.status === 'VALID') {
      const code = this.form.value.code;
      this.processing = true;
      // @ts-ignore
      const result = await this.fetchRequest(code);
      this.processing = false;
      if (result.statusCode === 200) {
        await this.afterSuccess(result);
      } else if (result.statusCode === 500) {
        this.errorMessage = 'Server Error';
      } else {
        this.errorMessage = result.responseBody.error;
      }
    }
  }

  private async afterSuccess(response: FetchResponse<any>) {
    this.afterMfa.emit(response);
  }

  async onCodeInput() {
    let code = this.form.get('code')?.value || '';
    this.form.get('code')?.setValue(code, { emitEvent: false });

    if (code.length === 6) await this.processToken();
  }
}
