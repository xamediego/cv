import {Directive, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {FetchResponse} from "../../services/generic/entities/FetchResponse";

export interface IFormComponent {
  onFormClosed: () => void;
  onFormSuccess: () => void;
  processMessage: string;
}

@Directive()
export abstract class AbstractFormComponent implements IFormComponent {
  public errorMessage: string | undefined = undefined;
  public processing: boolean = false;
  public updated: boolean = false;

  @Input() public formTitle: string = '';
  @Input() public formDescription: string = '';
  @Input() public cancelText: string = 'Cancel';
  @Input() public submitText: string = 'Submit';
  @Input() public successTitle: string = '';
  @Input() public successMessage: string = '';
  @Input() public continueText: string = '';
  @Input() public processMessage: string = '';
  @Input() public isDangerous: boolean = false;

  @Input() public form!: FormGroup;
  @Input() public onFormClosed! : () => void;
  @Input() public onFormSuccess! : () => void;
  @Input() public onSubmit! : () => Promise<{success : boolean, message : string}>;

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    this.processing = true;
    const submitResult = await this.onSubmit();
    this.processing = false;

    if(submitResult.success){
      this.updated = true;
      this.onFormSuccess();
    } else {
      this.errorMessage = submitResult.message;
    }
  }
}
