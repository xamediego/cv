import {Component} from "@angular/core";
import {RouterLink} from "@angular/router";
import {ButtonComponent} from "../../parts/button/button.component";

@Component({
  selector: 'app-authentication',
  imports: [RouterLink, ButtonComponent,],
  templateUrl: 'authentication.component.html',
  styleUrl: 'authentication.component.scss'
})
export class AuthenticationComponent {

}
