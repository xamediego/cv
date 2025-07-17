import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'portal-app-header',
  imports: [
    RouterLink,
  ],
  templateUrl: './portal.header.component.html',
  styleUrl: './portal.header.component.scss'
})
export class PortalHeaderComponent {

}
