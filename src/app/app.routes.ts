import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";

import {AuthGuard, RevAuthGuard} from './services/guards/guards';
import {SettingsComponent} from "./components/user/settings/settings.component";

export const appRoutes: Routes = [
  {path: '', loadChildren: () => import('./components/resume/resume.module').then((m) => m.ResumeModule)},
  {path: 'home', loadChildren: () => import('./components/portal/portal.module').then((m) => m.PortalModule)},
  {path: 'auth', loadChildren: () => import('./components/authentication/authentication.module').then((m) => m.AuthenticationModule), canActivate: [RevAuthGuard]},
  {path: 'user/settings', component : SettingsComponent, canActivate: [AuthGuard]},

  {path: '**', pathMatch : "full", redirectTo : ''},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
