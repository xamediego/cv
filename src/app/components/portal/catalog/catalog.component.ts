import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {ProjectType} from "../../../services/entities/project.type";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  imports: [
    EventSpinnerDirective
  ],
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  imagesLoaded : boolean = false;
  contentLoaded : boolean = false

  totalImages: number = 0;
  loadedImages: number = 0;

  public projectTypes: ProjectType[] = [];

  constructor(private projectTypeService: ProjectTypeService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const result = await this.projectTypeService.findCatalog();

    if (result.statusCode == 200) {
      this.projectTypes = result.responseBody;
    }

    this.contentLoaded = false;

    this.totalImages = this.projectTypes.length;
  }

  async navigate(type: ProjectType) {
    await this.router.navigate([`home/${type.type}`]);
  }

  onImageLoad() {
    this.loadedImages += 1;
    if(this.loadedImages == this.totalImages) this.imagesLoaded = true;
  }

  public isLoaded() : boolean{
    return this.imagesLoaded && this.contentLoaded;
  }
}
