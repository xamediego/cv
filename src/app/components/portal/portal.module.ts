import {NgModule} from '@angular/core';
import {CommonModule,  NgClass, NgTemplateOutlet} from '@angular/common';

import {RouterLink} from '@angular/router';
import {PortalRoutingModule} from './portal-routing.module';
import {BreadcrumbsComponent} from "./breadcrumbs/breadcrumbs.component";
import {PortalComponent} from "./portal.component";
import {HeaderComponent} from "../user/header/header.component";

@NgModule({
  declarations: [
    PortalComponent
  ],

  imports: [
    CommonModule,
    RouterLink,
    PortalRoutingModule,
    NgTemplateOutlet,
    NgClass,
    BreadcrumbsComponent,
    HeaderComponent,
  ]
})

export class PortalModule {}
