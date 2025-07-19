import {NgTemplateOutlet} from "@angular/common";
import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MatDialog} from '@angular/material/dialog';

import {UserdataDto} from "../../../services/entities/userdata.dto";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {AccountService} from "../../../services/account/account.service";
import {PortalHeaderComponent} from "../../portal/portal-header/portal.header.component";
import {DeleteFormComponent} from "./parts/deleteform/delete-form.component";
import {DisplaynameFormComponent} from "./parts/displaynameform/displayname-form.component";
import {UsernameFormComponent} from "./parts/usernameform/username-form.component";
import {EmailFormComponent} from "./parts/emailform/email-form.component";
import {PasswordFormComponent} from "./parts/passwordform/password-form.component";
import {MfaFormComponent} from "./parts/mfaform/mfa-form.component";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [
    NgTemplateOutlet,
    PortalHeaderComponent,
    EventSpinnerDirective
  ],
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  public loading : boolean = false;

  public userData: UserdataDto = {
    displayName: "",
    username: "",
    email: "",
    phone: "",
    twoFactorEnabled: false
  };

  constructor(private accountService: AccountService, private changeDec: ChangeDetectorRef, private dialog: MatDialog) {
  }

  public async ngOnInit(): Promise<void> {
    await this.getUserData();
  }

  private async getUserData() {
    this.changeDec.detectChanges();

    this.loading = true;
    const result: FetchResponse<UserdataDto> = await this.accountService.getAccountData();
    this.loading = false;

    this.changeDec.detectChanges();
    this.userData = result.responseBody;
  }

  public async showChangeDisplayName() {
    this.openDisplay(DisplaynameFormComponent)
  }

  public async showChangeUsername() {
    this.openDisplay(UsernameFormComponent)
  }

  public async showChangeEmail() {
    this.openDisplay(EmailFormComponent)
  }

  public async showResetPassword() {
    this.openDisplay(PasswordFormComponent)
  }

  public async showDeleteAccount() {
    this.openDisplay(DeleteFormComponent)
  }

  public async showEnable2FA() {
    this.openDisplay(MfaFormComponent)
  }

  private openDisplay(formComponent: any) {
    this.dialog.open(formComponent);
  }
}
