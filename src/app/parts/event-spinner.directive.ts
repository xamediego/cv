import {Directive, Input,  ViewContainerRef} from '@angular/core';
import {EventSpinnerComponent} from "./event-spinner/event-spinner.component";

@Directive({
  selector: '[appEventSpinner]',
})
export class EventSpinnerDirective {

  private hasView = false;

  constructor(private viewContainer : ViewContainerRef) { }

  @Input() set appEventSpinner(data : {condition : boolean, eventMessage : string, stretchToParent : boolean}) {
    if (data.condition && !this.hasView) {
      const spinnerRef = this.viewContainer.createComponent(EventSpinnerComponent);
      spinnerRef.setInput('eventMessage', data.eventMessage);
      spinnerRef.setInput('stretchToParent', data.stretchToParent);
      this.hasView = true;
    } else if (!data.condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
