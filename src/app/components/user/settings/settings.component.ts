import {NgTemplateOutlet} from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from "@angular/core";

import {MatDialog} from '@angular/material/dialog';

import {UserData} from "../../../services/entities/userData";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {AccountService} from "../../../services/account/account.service";
import {PortalHeaderComponent} from "../../portal/portal-header/portal.header.component";
import {DisplaynameFormComponent} from "../../../parts/forms/displaynameform/displayname-form.component";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {FormComponent} from "../../../parts/forms/form.component";
import {EmailFormComponent} from "../../../parts/forms/emailform/email-form.component";
import {UsernameFormComponent} from "../../../parts/forms/usernameform/username-form.component";
import {PasswordFormComponent} from "../../../parts/forms/passwordform/password-form.component";
import {DeleteFormComponent} from "../../../parts/forms/deleteform/delete-form.component";
import {SetMfaFormComponent} from "../../../parts/forms/setmfaform/set-mfa-form.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [
    NgTemplateOutlet,
    PortalHeaderComponent,
    EventSpinnerDirective
  ],
  standalone: true
})
export class SettingsComponent implements OnInit {
  public loading = false;
  public isMobile = false;

  public activeFormComponent: Type<any> | null = null;

  public userData: UserData = {
    displayName: "",
    username: "",
    email: "",
    phone: "",
    twoFactorEnabled: false
  };

  constructor(
    private accountService: AccountService,
    private changeDec: ChangeDetectorRef,
    private dialog: MatDialog,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isMobile = window.innerWidth <= 500;

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 500;
      this.changeDec.detectChanges();
    });

    await this.getUserData();
  }

  private async getUserData() {
    this.changeDec.detectChanges();

    this.loading = true;
    const result: FetchResponse<UserData> = await this.accountService.getAccountData();
    this.loading = false;

    this.userData = result.responseBody;
    this.changeDec.detectChanges();
  }

  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) dynamicComponentContainer!: ViewContainerRef;
  public showForm(component: Type<FormComponent>) {
    if (this.isMobile) {
      this.showNormal(component);
    } else {
      this.showDialog(component);
    }
  }

  public showDialog(component: Type<FormComponent>) {
    const dialogRef = this.dialog.open(
      component, {
        maxWidth: 300,
        disableClose: true,
      });

    const instance = dialogRef.componentInstance;
    if (instance) {
      instance.onFormClosed = () => this.dialog.closeAll();
      instance.onFormSuccess = async () => {
        await this.getUserData();
      };
    }
  }

  public showNormal(component: Type<FormComponent>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.onFormClosed = () => this.closeEmbeddedForm();
    componentRef.instance.onFormSuccess = () => this.onFormSuccess();

    this.activeFormComponent = component;

    history.pushState(null, '', (window.location.origin + window.location.pathname));
    window.addEventListener('popstate', this.handlePopState);
  }

  public async closeEmbeddedForm() {
    this.dynamicComponentContainer.clear();
    this.activeFormComponent = null;
    window.removeEventListener('popstate', this.handlePopState);
  }

  private handlePopState = async () => {await this.closeEmbeddedForm();}

  private async onFormSuccess() {
    await this.getUserData();
  }

  public async showChangeDisplayName() {
    this.showForm(DisplaynameFormComponent);
  }

  public showChangeUsername() {
    this.showForm(UsernameFormComponent);
  }

  public showChangeEmail() {
    this.showForm(EmailFormComponent);
  }

  public showResetPassword() {
    this.showForm(PasswordFormComponent);
  }

  public showDeleteAccount() {
    this.showForm(DeleteFormComponent);
  }

  public showEnable2FA() {
    this.showForm(SetMfaFormComponent);
  }
}
