
import {NgTemplateOutlet} from "@angular/common";
import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {UserDataDto} from "../../../services/entities/UserDataDto";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {AccountService} from "../../../services/account/AccountService";
import {PortalHeaderComponent} from "../../portal/portal-header/portal.header.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [
    NgTemplateOutlet,
    PortalHeaderComponent
  ],
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit{

  public userData : UserDataDto = {
    username : "",
    email: "",
    phone:"",
    twoFactorEnabled : false
  };

  constructor(private accountService : AccountService, private changeDec : ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    await this.getUserData();
  }

  private async getUserData(){
    this.changeDec.detectChanges();

    const result : FetchResponse<UserDataDto> = await this.accountService.getAccountData();

    this.userData = result.responseBody;
    console.log(this.userData)
  }

  async showChangeUsername() {

  }

  async showChangeEmail() {

  }

  async showResetPassword() {

  }

  async showDeleteAccount(){

  }

  async showEnable2FA() {

  }
}
