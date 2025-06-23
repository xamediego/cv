import {Component} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

import {Router} from "@angular/router";

@Component({
    selector: 'app-breadcrumbs',
    imports: [
        NgForOf,
        NgIf
    ],
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {


  constructor(private router : Router) {
  }

  async navigate(i :number) {
    const url = window.location.pathname.split("/").filter(p => p !== "").slice(0, i + 1);
    await this.router.navigate(url);
  }

  getLink() : string[] {
    return window.location.pathname.split("/").filter(p => p !== "").map(l => l.charAt(0).toUpperCase() + l.slice(1));
  }
}
