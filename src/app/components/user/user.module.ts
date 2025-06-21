import {NgModule} from '@angular/core';
import {CommonModule,  NgClass, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';

import {RouterLink} from '@angular/router';
import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {HeaderComponent} from "./header/header.component";


@NgModule({
  declarations: [
    UserComponent,
  ],

  imports: [
    CommonModule,
    RouterLink,
    UserRoutingModule,
    NgTemplateOutlet,
    NgIf,
    NgClass,
    NgForOf,
    HeaderComponent,
  ]
})

export class UserModule {}
