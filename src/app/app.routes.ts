import {RouterModule, Routes} from '@angular/router';
import {CvComponent} from "./components/cv/cv.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {NgModule} from "@angular/core";

export const appRoutes: Routes = [
  {path: 'cv', component: CvComponent},
  {path: 'projects', component: ProjectsComponent},

  //needs to be put at la bottom
  {path: '**', redirectTo : 'cv'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {

}
