import {
  Component,
  Injector,
  Input,
  forwardRef, OnInit, Self, Optional,
  Host, AfterViewInit,
} from '@angular/core';

import {
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-form-input',
  styleUrl: './form-input.component.scss',
  templateUrl: './form-input.component.html'
})
export class FormInputComponent implements ControlValueAccessor{
  @Input() formControlName?: string
  @Input() label!: string;
  @Input() type: string = 'text';

  value: string = '';
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
