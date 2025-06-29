import {Directive, Input,  ViewContainerRef} from '@angular/core';
import {EventSpinnerComponent} from "./event-spinner/event-spinner.component";

@Directive({
  selector: '[appEventSpinner]',
})
export class EventSpinnerDirective {

  private hasView = false;

  constructor(private viewContainer : ViewContainerRef) { }

  @Input() set appEventSpinner(data : {
    condition : boolean,
    eventMessage? : string,
    size? : string,
    stretchToParent? : boolean,
    progress? : string,
    gap? : string,
  }) {
    if (data.condition && !this.hasView) {
      const spinnerRef = this.viewContainer.createComponent(EventSpinnerComponent);
      spinnerRef.setInput('eventMessage', data.eventMessage);
      spinnerRef.setInput('size', data.size);
      spinnerRef.setInput('stretchToParent', data.stretchToParent);
      spinnerRef.setInput('progress', data.progress);
      spinnerRef.setInput('gap', data.gap);
      this.hasView = true;
    } else if (!data.condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
