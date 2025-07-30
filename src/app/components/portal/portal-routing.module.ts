import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PortalComponent} from './portal.component';
import {ProjectComponent} from "./project/project.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {TypeComponent} from "./type/type.component";
import {AdminGuard} from "../../services/guards/guards";
import {EditProjectComponent} from "./edit-project/edit-project.component";
import {NewProjectComponent} from "./new-project/new-project.component";

const routes: Routes = [

  {
    path: '',
    component: PortalComponent,
    children: [
      {path: '', component: CatalogComponent},
      {
        path: 'project/new',
        component: NewProjectComponent,
        canActivate: [AdminGuard]
      },

      {
        path: 'project/edit/:type/:title',
        component: EditProjectComponent,
        canActivate: [AdminGuard]
      },

      {path: 'catalog', component: CatalogComponent},
      {path: ':type', component: TypeComponent},
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
