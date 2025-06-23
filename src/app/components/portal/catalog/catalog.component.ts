import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {ProjectType} from "../../../services/entities/ProjectType";

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  public isLoading: boolean = true;

  public projectTypes: ProjectType[] = [];

  constructor(private projectTypeService: ProjectTypeService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const result = await this.projectTypeService.findAll();

    if (result.statusCode == 200) {
      this.projectTypes = result.responseBody;
    }

    this.isLoading = false;
  }

  async navigate(type: ProjectType) {
    await this.router.navigate([`home/${type.type}`]);
  }

  onImageLoad() {

  }
}
