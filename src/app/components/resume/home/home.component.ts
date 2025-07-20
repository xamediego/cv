import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ProjectService} from "../../../services/project/project.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {NgStyle, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    EventSpinnerDirective,
    NgTemplateOutlet,
    NgStyle,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private dataLoaded: boolean = false;
  private initialImageLoaded: boolean = false;

  public featuredProjects: {title : string, url : string}[] = [];

  private interval : any;

  constructor(private projectService: ProjectService) {}

  public activeIndex = 0;

  public async ngOnInit() {
    await this.loadData();
    this.interval = this.createInterval();
  }

  private createInterval(){
    return setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.featuredProjects.length;
    }, 5000);
  }

  private resetInterval(){
    clearInterval(this.interval);
    this.interval = this.createInterval();
  }

  private async loadData() {
    const result = this.projectService.findFeaturedLocal();
    this.featuredProjects = [...result];

    this.dataLoaded = true;
  }

  public onImagesLoad(index: number) {
    if (index == 0) this.initialImageLoaded = false
  }

  public isLoaded(): boolean {
    return this.dataLoaded && this.initialImageLoaded;
  }

  public next() {
    this.resetInterval();

    if(this.activeIndex == this.featuredProjects.length - 1){
      this.activeIndex = 0;
    } else {
      this.activeIndex += 1;
    }
  }

  public previous(){
    this.resetInterval();

    if(this.activeIndex == 0){
      this.activeIndex = this.featuredProjects.length - 1;
    } else {
      this.activeIndex -= 1;
    }
  }
}
