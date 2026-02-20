import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgOptimizedImage, NgStyle} from "@angular/common";

import {ProjectHolderComponent} from "../../../parts/project-holder/project-holder.component";
import {ProjectType} from "../../../services/entities/project.type";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {JwtService} from "../../../services/guards/jwt.service";
import {Project} from "../../../services/entities/project";
import {BreadcrumbsComponent} from "../breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-type',
  imports: [
    NgOptimizedImage,
    ProjectHolderComponent,
    EventSpinnerDirective,
    BreadcrumbsComponent,
    NgStyle
  ],
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss'
})
export class TypeComponent implements OnInit {
  imagesLoaded: boolean = false;
  contentLoaded: boolean = false;

  totalImages: number = 0;
  loadedImages: number = 0;

  public projectType: ProjectType | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectTypeService: ProjectTypeService,
    protected jwtService : JwtService,
) {
  }

  public async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const type = params.get('type') || '';
      await this.loadData(type);
    });
  }

  private async loadData(type: string) {
    this.contentLoaded = false;
    const result = await this.projectTypeService.findByTypeComplete(type);
    if (result.statusCode == 200) {
      this.projectType = result.responseBody
      this.totalImages = this.projectType.projects.length
    }

    this.contentLoaded = true;
  }

  public onImageLoad() {
    this.loadedImages += 1;
    if (this.loadedImages == this.totalImages) this.imagesLoaded = true;
  }

  public isLoaded(): boolean {
    return this.imagesLoaded && this.contentLoaded;
  }

  public async newProject() {
    const route = `home/project/new`
    await this.router.navigate([route]);
  }

  public onProjectSelect : (projectType : ProjectType, project : Project) => void = async (projectType, project) => {
    const route = `home/project/${projectType.type}/${project.title}`
    await this.router.navigate([route]);
  }
}
