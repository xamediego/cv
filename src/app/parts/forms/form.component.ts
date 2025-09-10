import {Directive, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {FetchResponse} from "../../services/generic/entities/FetchResponse";

export interface IFormComponent {
  onFormClosed: () => void;
  onFormSuccess: () => void;
  processMessage: string;
}

@Directive()
export abstract class AbstractFormComponent<T> implements IFormComponent {
  public form: FormGroup;
  public errorMessage: string | undefined = undefined;
  public processing: boolean = false;
  public updated: boolean = false;

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};
  @Input() public processMessage: string = '';

  protected constructor(form: FormGroup) {
    this.form = form;
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    await this.processForm(this.updateRequest());
  }

  protected async processForm(fetchRequest: (code? : string) => Promise<FetchResponse<T>>) {
    const response = await fetchRequest();
    if (response.statusCode === 200) {
      await this.onSuccess(response.responseBody);
    } else if (response.statusCode == 500) {
      this.errorMessage = "Internal Server Error";
    } else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody.error;
    }
  }

  protected onSuccess: (data : T) => Promise<void> = async (data : T) => {
    this.updated = true;
    this.onFormSuccess();
  }

  protected abstract updateRequest(): () => Promise<FetchResponse<any>>;
}
