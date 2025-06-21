import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PortalComponent} from './portal.component';
import {ProjectComponent} from "./project/project.component";


const routes: Routes = [
  {
    path: '',
    component: PortalComponent,

    children: [
      {path: 'project/:type/:title', component: ProjectComponent},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PortalRoutingModule {
}
