import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {AuthenticationComponent} from "./authentication.component";

const routes: Routes = [
  { path: '', component: AuthenticationComponent},

  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthenticationRoutingModule {}
