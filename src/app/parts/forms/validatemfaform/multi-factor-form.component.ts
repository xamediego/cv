import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {AbstractFormComponent} from "../form.component";

@Component({
  selector: 'app-validate-mfa-form',
  templateUrl: './multi-factor-form.component.html',
  imports: [ReactiveFormsModule, EventSpinnerDirective],
  styleUrls: ['../form.component.scss']
})
export class MultiFactorFormComponent<T> extends AbstractFormComponent<T> {
  @Input() public fetchRequest!: (code: string) => Promise<FetchResponse<any>>;
  @Output() public afterMfaEvent = new EventEmitter();

  constructor() {
    super(new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern(/^\d{0,6}$/)])
    }));
  }

  private async afterSuccess(response: FetchResponse<any>) {
    this.afterMfaEvent.emit(response);
  }

  public async onCodeInput() {
    let code = this.form.get('code')?.value || '';
    this.form.get('code')?.setValue(code, {emitEvent: false});

    if (code.length === 6) await this.submit();
  }

  protected updateRequest(): () => Promise<FetchResponse<any>> {
    const code = this.form.value.code;

    return async () => {
      this.processing = true
      const result = await this.fetchRequest(code);
      this.processing = false;

      return result;
    };
  }
}
