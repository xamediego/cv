import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {MfaService} from "../../../services/mfa/mfa.service";
import {AbstractFormComponent} from "../abstract.form";
import {FormComponent} from "../form/form.component";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-submit-form',
  templateUrl: './submit-form.component.html',
  imports: [FormComponent, ReactiveFormsModule],
  styleUrl: '../form.component.scss'
})
export class SubmitFormComponent extends AbstractFormComponent{
    public mfaCheck: boolean = false;

    @Input() request!: () => Promise<FetchResponse<any>>;

    constructor(private mfaService: MfaService) {
      super();
    }

    protected submitCallBack: () => Promise<{ success: boolean, message: string }> = async () => {
        return this.submitData(this.request);
    }

    @ViewChild('mfaComponentContainer', {read: ViewContainerRef}) mfaComponentContainer!: ViewContainerRef;
    protected submitData: (fetchRequest: (code?: string) => Promise<FetchResponse<any>>) => Promise<{
        success: boolean,
        message: string
    }> = async (fetchRequest: (code?: string) => Promise<FetchResponse<any>>) => {
        const response: FetchResponse<any> = await fetchRequest();
        if (response.statusCode == 200) {
            return {
                success: true,
                message: ""
            };
        } else if (response.statusCode === 409) {
            this.mfaCheck = true;
            const result = await this.handleMfa(this.mfaComponentContainer, async (code) => await fetchRequest(code));
            this.mfaCheck = false;
            if(result.statusCode == 200) {
              return {
                success: true,
                message: ""
              };
            } else {
              return {
                success: false,
                message: "MFA validation failed"
              };
            }
        } else if (response.statusCode == 500) {
            return {
                success: false,
                message: "Internal server error"
            };
        } else {
            return {
                success: false,
                message: response.responseBody.error
            };
        }
    }

    protected handleMfa: (viewContainerRef: ViewContainerRef, fetchWithCode: (code: string) => Promise<FetchResponse<any>>) => Promise<FetchResponse<any>> = async (viewContainerRef: ViewContainerRef, fetchWithCode: (code: string) => Promise<FetchResponse<any>>) => {
        this.mfaCheck = true;

        return await this.mfaService.openMfaScreen<any>(
            fetchWithCode,
            () => {
                this.mfaCheck = false;
                viewContainerRef.clear();
            },
            viewContainerRef,
            "Validating code"
        );
    }
}
