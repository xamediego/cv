import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {RegisterService} from "../../../services/register/register.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {ButtonComponent} from "../../../parts/button/button.component";

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.scss'],
  imports: [
    EventSpinnerDirective,
    ButtonComponent,
    RouterLink
  ]
})
export class RegistrationConfirmationComponent implements OnInit {

  token: string | null = null;
  username: string | null = null;

  confirmMessage: string = 'confirming email';
  confirming: boolean = false;
  confirmed: boolean = false;
  statusText: string = "";

  constructor(
    private route: ActivatedRoute,
    private registerService: RegisterService,
  ) {
  }

  async ngOnInit() {
    this.route.queryParamMap.subscribe(async params => {
      this.token = params.get('token');
      this.username = params.get('username');
      if (this.token != '' && this.token != undefined && this.username != null && this.username != '') {
        await this.confirmRegistration(this.username, this.token);
      } else {
        this.confirmMessage = "No confirmation token provided";
      }
    });
  }

  private async confirmRegistration(username: string, token: string) {
    this.confirming = true;
    const confirmResult: FetchResponse<string> = await this.registerService.confirmRegistration(username, token);
    this.confirming = false;

    if (confirmResult.statusCode === 200) {
      this.confirmed = true;
      this.confirmMessage = 'Email confirmed.';
      this.statusText = 'Your email has been successfully confirmed, you can now authentication, upload, comment and rate.'
    } else {
      this.confirmMessage = confirmResult.statusText;
    }
  }
}
