import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ProjectService} from "../../../services/project/project.service";
import {ProjectDto} from "../../../services/entities/ProjectDto";

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public featuredProjects : ProjectDto[] = [];

  constructor(private projectService : ProjectService) {}

  public activeIndex = 0;

  public async ngOnInit() {
    await this.loadData();

    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.featuredProjects.length;
    }, 5000);
  }

  private async loadData(){
    const result = await this.projectService.findFeatured();

    if(result.statusCode == 200){
      this.featuredProjects = [...result.responseBody]
    }
  }
}
