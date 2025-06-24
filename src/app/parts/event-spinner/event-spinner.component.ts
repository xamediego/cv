import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-event-spinner',
  templateUrl: './event-spinner.component.html',
  styleUrl: './event-spinner.component.scss'
})
export class EventSpinnerComponent{
  @Input('eventMessage') eventMessage: string = '';
  @Input('stretchToParent') stretchToParent: boolean = false;

  @HostBinding('style.width') get width() {
    return this.stretchToParent ? '100%' : null;
  }

  @HostBinding('style.height') get height() {
    return this.stretchToParent ? '100%' : null;
  }
}
