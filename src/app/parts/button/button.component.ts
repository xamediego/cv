import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgClass} from '@angular/common';

export type ButtonColor = 'BASE' | 'PRIMARY' | 'SECONDARY' | 'DANGEROUS';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  imports: [NgClass],
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonText: string = 'Button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() color: ButtonColor = 'BASE';
  @Input() disabled: boolean = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent) {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
