import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";

export const appRoutes: Routes = [
  // {path: '', pathMatch : "full", redirectTo : 'resume'},

  {path: '', loadChildren: () => import('./components/user/user.module').then((m) => m.UserModule)},
  {path: 'home', loadChildren: () => import('./components/portal/portal.module').then((m) => m.PortalModule)},

  {path: '**', pathMatch : "full", redirectTo : ''},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
