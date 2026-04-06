import {Directive, Input, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";

export interface IFormComponent {
  onFormClosed: () => void;
  onFormSuccess: () => void;
  processMessage: string;
}

@Directive()
export abstract class AbstractFormComponent implements IFormComponent, OnInit {
  public errorMessage: string | undefined = undefined;
  public processing: boolean = false;
  public updated: boolean = false;

  @Input() public formTitle: string = '';
  @Input() public formDescription: string = '';
  @Input() public cancelText: string = 'Cancel';
  @Input() public submitText: string = 'Submit';
  @Input() public successTitle: string = '';
  @Input() public successMessage: string = '';
  @Input() public continueText: string = 'Return';
  @Input() public processMessage: string = 'Processing';
  @Input() public isDangerous: boolean = false;

  @Input() public form!: FormGroup;
  @Input() public onFormClosed! : () => void;
  @Input() public onFormSuccess! : () => void;
  @Input() public onSubmit! : () => Promise<{success : boolean, message : string}>;
  @Input() submissionTriggers?: Array<Observable<void>>;
  @Input() showDefaultButtons : boolean = true;

  public ngOnInit(): void {
    this.submissionTriggers?.forEach(trigger => {
      trigger.subscribe(() => this.submit());
    })
  }

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
