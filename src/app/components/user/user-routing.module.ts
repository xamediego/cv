import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {UserComponent} from './user.component';
import {ResumeComponent} from "./resume/resume.component";
import {ArchiveComponent} from "./archive/archive.component";

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {path: 'resume', title: 'Resume', component: ResumeComponent},
      {path: 'archive', title: 'Archive', component: ArchiveComponent},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule {
}
