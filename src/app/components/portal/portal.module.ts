import {NgModule} from '@angular/core';
import {CommonModule,  NgClass, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';

import {RouterLink} from '@angular/router';
import {PortalRoutingModule} from './portal-routing.module';
import {PortalComponent} from './portal.component';
import {HeaderComponent} from "./header/header.component";


@NgModule({
  declarations: [
    PortalComponent,
  ],

  imports: [
    CommonModule,
    RouterLink,
    PortalRoutingModule,
    NgTemplateOutlet,
    NgIf,
    NgClass,
    NgForOf,
    HeaderComponent,
  ]
})

export class PortalModule {}
