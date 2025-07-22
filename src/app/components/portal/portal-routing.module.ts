import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PortalComponent} from './portal.component';
import {ProjectComponent} from "./project/project.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {TypeComponent} from "./type/type.component";
import {NewProjectComponent} from "./new-project/new-project.component";
import {AdminGuard} from "../../services/guards/guards";

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {path: '', component: CatalogComponent},
      {path: 'catalog', component: CatalogComponent},
      {path: ':type', component: TypeComponent},
      {path: ':type/new', component: NewProjectComponent, canActivate : [AdminGuard]},
      {path: ':type/:title', component: ProjectComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PortalRoutingModule {
}
