import {ViewContainerRef} from "@angular/core";
import {FetchResponse} from "../../services/generic/entities/FetchResponse";
import {MfaService} from "../../services/mfa/mfa.service";

export abstract class MfaFormAbstract {
  private mfaService : MfaService;
  protected constructor(mfaService: MfaService) {this.mfaService = mfaService;}
  mfaCheck = false;

  protected async handleMfa<T>(
    viewContainerRef : ViewContainerRef,
    fetchWithCode: (code: string) => Promise<FetchResponse<T>>,
    onSuccess: (response: FetchResponse<T>) => void,
    onError: (message: string) => void) {
    try {
      this.mfaCheck = true;
      const response = await this.mfaService.openMfaScreen<T>(
        fetchWithCode,
        () => {
          this.mfaCheck = false;
          viewContainerRef.clear();},
        viewContainerRef
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
