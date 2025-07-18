import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {SettingsComponent} from "./components/user/settings/settings.component";

export const appRoutes: Routes = [
  {path: '', loadChildren: () => import('./components/resume/user.module').then((m) => m.UserModule)},
  {path: 'home', loadChildren: () => import('./components/portal/portal.module').then((m) => m.PortalModule)},
  {path: 'auth', loadChildren: () => import('./components/authentication/authentication.module').then((m) => m.AuthenticationModule)},
  {path: 'user/settings', component : SettingsComponent},

  {path: '**', pathMatch : "full", redirectTo : ''},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
