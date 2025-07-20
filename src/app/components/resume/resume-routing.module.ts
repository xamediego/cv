import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CvComponent} from "./cv/cv.component";
import {ArchiveComponent} from "./archive/archive.component";
import {HomeComponent} from "./home/home.component";
import {ResumeComponent} from "./resume.component";

const routes: Routes = [
  {
    path: '',
    component: ResumeComponent,
    children: [
      {path: '', title: 'Home', component: HomeComponent},
      {path: 'resume', title: 'Resume', component: CvComponent},
      {path: 'archive', title: 'Archive', component: ArchiveComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumeRoutingModule {
}
