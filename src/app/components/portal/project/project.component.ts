import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgTemplateOutlet} from "@angular/common";

import {ProjectService} from "../../../services/project/project.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {DownloadButtonComponent} from "../../../parts/download-button/download-button.component";
import {environment} from "../../../../environments/environment";
import {ImageViewComponent} from "../../../parts/image-view/image-view.component";
import {Project} from "../../../services/entities/project";


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  imports: [
    NgTemplateOutlet,
    EventSpinnerDirective,
    DownloadButtonComponent,
    ImageViewComponent
  ],
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  public project: Project | undefined;
  private apiLink: string = `${environment.MainApi}/Project`;

  public isSmallScreen: boolean = false;
  private readonly smallScreenSize: number = 920;

  private contentLoaded: boolean = false;
  private projectImagesLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  async ngOnInit(): Promise<void> {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;

    this.route.paramMap.subscribe(async params => {
      const title = params.get('title') || '';
      await this.loadData(title);
    });
  }

  private async loadData(projectName: string) {
    const result = await this.projectService.findByTitle(projectName)
    if (result.statusCode == 200) {this.project = result.responseBody}
    this.contentLoaded = true;
  }

  @HostListener('window:resize')
  public onResize() {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;
    this.checkImageHolderSize();
  }

  private checkImageHolderSize() {
    const mainImageElement = document.getElementById("main-image") as HTMLElement | null;
    const imageHolderElement = document.getElementById("image-holder") as HTMLElement | null;

    if (mainImageElement && imageHolderElement) {
      const mainImageWidth = mainImageElement.offsetWidth;
      const holderWidth = imageHolderElement.offsetWidth;

      if (holderWidth > (mainImageWidth + 10)) {
        imageHolderElement.style.overflowX = "hidden";
        imageHolderElement.style.padding = "3px"
      } else {
        imageHolderElement.style.removeProperty('overflow-x');
      }
    }
  }

  public createProjectString(publishedDate: Date) {
    const date = new Date(publishedDate);
    return `Created:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  public isLoaded(): boolean {
    return this.projectImagesLoaded && this.contentLoaded;
  }

  public createLink(project: Project) {
    return `${this.apiLink}/download/${project.title}/${project.id}`;
  }

  public onAllImagesLoaded() {
    this.projectImagesLoaded = true;
  }
}
