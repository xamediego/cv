import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../services/account/account.service";
import {PasswordValidatorComponent} from "../../password-validator/password-validator.component";
import {MfaService} from "../../../services/mfa/mfa.service";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {MfaFormAbstract} from "../mfa-form.abstract";
import {FormComponent} from "../form.component";
import {Project} from "../../../services/entities/project";
import {ProjectType} from "../../../services/entities/project.type";

@Component({
  selector: 'app-new-project-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordValidatorComponent,
    EventSpinnerDirective,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: '../form.component.scss'
})
export class ProjectFormComponent implements FormComponent {

  form: FormGroup;
  errorMessage: string | undefined = undefined;
  processing : boolean = false;
  processMessage : string = '';
  updated : boolean = false;

  @Input() public project: Project | undefined;
  @Input() public projectTypes: ProjectType[] = [];

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    await this.processForm<string>(this.updateRequest());
  }

  private async processForm<T>(fetchRequest: (code?: string) => Promise<FetchResponse<T>>) {
    const response = await fetchRequest();
    if (response.statusCode === 200) {
      await this.onSuccess();
    } else {
      this.form.markAllAsTouched();
      // @ts-ignore
      this.errorMessage = response.responseBody;
    }
  }

  private onSuccess: () => Promise<void> = async () => {
    this.updated = true;
    this.onFormSuccess();
  }

  private updateRequest(): (code?: string) => Promise<FetchResponse<string>> {
    const {currentPassword, newPassword} = this.form.value;

    return async (code?: string) => {
      this.processing = true;
      const result = await this.accountService.updatePassword(currentPassword, newPassword, code);
      this.processing = false;
      return result;
    };
  }
}
