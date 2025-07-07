import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {RegisterService} from "../../../services/register/register.service";

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.scss'],
})
export class RegistrationConfirmationComponent implements OnInit {

  token: string | null = null;
  username: string | null = null;

  confirmMessage: string = 'confirming email';
  confirmed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private registerService: RegisterService,
    private router : Router,
  ) {
  }

  async ngOnInit() {

    this.route.queryParamMap.subscribe(async params => {
      this.token = params.get('token');
      this.username = params.get('username');

      if (this.token != '' && this.token != undefined) {
        const confirmResult: FetchResponse<string> = await this.registerService.confirmRegistration(
          this.username as string ,
          this.token as string,);

        if (confirmResult.statusCode === 200) {
          this.confirmed = true;
          this.confirmMessage = 'Email has been confirmed, you can now login.';
        } else {
          this.confirmMessage = confirmResult.statusText;
        }
      } else {
        this.confirmMessage = "No confirmation token provided";
      }

    });
  }

  async showLogin(){
    await this.router.navigate(['auth/login'])
  }
}
