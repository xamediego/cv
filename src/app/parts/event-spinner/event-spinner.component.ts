import {Component, HostBinding, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-event-spinner',
  templateUrl: './event-spinner.component.html',
  imports: [
    NgStyle
  ],
  styleUrl: './event-spinner.component.scss'
})
export class EventSpinnerComponent{

  @Input() eventMessage: string = '';
  @Input() gap: string = '30px';
  @Input() stretchToParent: boolean = false;

  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() progress: number | null = null;

  get spinnerSize(): string {
    switch (this.size) {
      case 'small': return '25px';
      case 'large': return '60px';
      default: return '40px';
    }
  }

  get fontSize(): string {
    switch (this.size) {
      case 'small': return '16px';
      case 'large': return '22px';
      default: return '18px';
    }
  }

  get fontWeight(): string {
    return this.size === 'small' ? '200' : '400';
  }

  @HostBinding('style.width') get width() {
    return this.stretchToParent ? '100%' : null;
  }

  @HostBinding('style.height') get height() {
    return this.stretchToParent ? '100%' : null;
  }
}
