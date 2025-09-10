import {Input} from "@angular/core";

export interface IFormComponent {
  onFormClosed : () => void;
  onFormSuccess : () => void;
  processMessage : string;
}

export abstract class AbstractFormComponent implements IFormComponent {
  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};
  @Input() processMessage : string = '';
}
