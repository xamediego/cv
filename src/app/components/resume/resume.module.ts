import {NgModule} from '@angular/core';
import {CommonModule,  NgClass, NgTemplateOutlet} from '@angular/common';

import {RouterLink} from '@angular/router';

import {ResumeRoutingModule} from './resume-routing.module';
import {ResumeComponent} from './resume.component';
import {HeaderComponent} from "./header/header.component";

@NgModule({
  declarations: [ResumeComponent,],

  imports: [
    CommonModule,
    RouterLink,
    ResumeRoutingModule,
    NgTemplateOutlet,
    NgClass,
    HeaderComponent,
  ]
})

export class ResumeModule {}
