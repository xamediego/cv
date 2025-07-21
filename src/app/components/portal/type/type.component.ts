import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";
import {ProjectType} from "../../../services/entities/project.type";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";

@Component({
    selector: 'app-type',
  imports: [
    NgOptimizedImage,
    ProjectDisplayComponent,
    EventSpinnerDirective
  ],
    templateUrl: './type.component.html',
    styleUrl: './type.component.scss'
})
export class TypeComponent implements OnInit {
  imagesLoaded : boolean = false;
  contentLoaded : boolean = false;

  totalImages: number = 0;
  loadedImages: number = 0;

  public projectType: ProjectType | null = null;

  constructor(private route: ActivatedRoute, private projectTypeService: ProjectTypeService) {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const type = params.get('type') || '';
      await this.loadData(type);
    });
  }

  private async loadData(type : string){
    const result = await this.projectTypeService.findByTypeComplete(type);
    if(result.statusCode == 200){
      this.projectType = result.responseBody
      this.totalImages = this.projectType.projects.length + 1
    }

    this.contentLoaded = true;
  }

  public onImageLoad(){
    this.loadedImages += 1;
    if(this.loadedImages == this.totalImages) this.imagesLoaded = true;
  }

  public isLoaded() : boolean{
    return this.imagesLoaded && this.contentLoaded;
  }
}
