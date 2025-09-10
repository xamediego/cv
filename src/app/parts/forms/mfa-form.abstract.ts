import {Directive, ViewChild, ViewContainerRef} from "@angular/core";
import {FetchResponse} from "../../services/generic/entities/FetchResponse";
import {MfaService} from "../../services/mfa/mfa.service";
import {AbstractFormComponent, IFormComponent} from "./form.component";
import {FormGroup} from "@angular/forms";

@Directive()
export abstract class MfaFormAbstract<T> extends AbstractFormComponent<T> implements IFormComponent{
  private mfaService: MfaService;
  public mfaCheck = false;

  protected constructor(mfaService: MfaService, form: FormGroup) {
    super(form);
    this.mfaService = mfaService;
  }

  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) dynamicComponentContainer!: ViewContainerRef;
  protected override async processForm(fetchRequest: (code?: string) => Promise<FetchResponse<T>>) {
    const response = await fetchRequest();
    if (response.statusCode === 200) {
      await this.onSuccess();
    } else if (response.statusCode === 409) {
      await this.handleMfa<T>(
        this.dynamicComponentContainer,
        async (code) => await fetchRequest(code),
        async () => await this.onSuccess(),
        (message) => (this.errorMessage = message),
        this.processMessage
      );
    } else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody;
    }
  }

  protected override onSuccess: () => Promise<void> = async () => {
    this.mfaCheck = true;
    this.updated = true;
    this.onFormSuccess();
  }

  protected async handleMfa<T>(
    viewContainerRef: ViewContainerRef,
    fetchWithCode: (code: string) => Promise<FetchResponse<T>>,
    onSuccess: (response: FetchResponse<T>) => void,
    onError: (message: string) => void,
    processMessage : string) {
    try {
      this.mfaCheck = true;
      const response = await this.mfaService.openMfaScreen<T>(
        fetchWithCode,
        () => {
          this.mfaCheck = false;
          viewContainerRef.clear();
        },
        viewContainerRef,
        processMessage
      );
      if (response.statusCode === 200) {
        onSuccess(response);
      } else {
        // @ts-ignore
        onError(response.responseBody.error);
      }
    } catch {
      onError('MFA failed. Please try again.');
    }
  }
}
