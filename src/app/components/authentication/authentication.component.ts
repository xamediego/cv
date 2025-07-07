import {Component} from "@angular/core";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-authentication',
  imports: [RouterLink,],
  templateUrl: 'authentication.component.html',
  styleUrl: 'authentication.component.scss'
})
export class AuthenticationComponent {

  constructor(private router : Router) {
  }

  public async register(){
   await this.router.navigate(["auth/register"])
  }

  public async login(){
    await this.router.navigate(["auth/login"])
  }
}
