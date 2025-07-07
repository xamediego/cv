import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ProjectService} from "../../../services/project/project.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    EventSpinnerDirective,
    NgTemplateOutlet,

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private dataLoaded: boolean = false;
  private initialImageLoaded: boolean = false;

  public featuredProjects: {title : string, url : string}[] = [];

  constructor(private projectService: ProjectService) {
  }

  public activeIndex = 0;

  public async ngOnInit() {
    await this.loadData();

    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.featuredProjects.length;
    }, 5000);
  }

  private async loadData() {
    const result = this.projectService.findFeaturedLocal();
    this.featuredProjects = [...result];
    this.dataLoaded = true;
  }

  public onImagesLoad(index: number) {
    if (index == 0) this.initialImageLoaded = true
  }

  public isLoaded(): boolean {
    return this.dataLoaded && this.initialImageLoaded;
  }
}
