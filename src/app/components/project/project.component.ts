import {Component, OnInit} from '@angular/core';

import * as projectData from "../../../assets/projects.json";
import {ProjectType} from "../projects/entities/ProjectType";
import {Project} from "../projects/entities/Project";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit{

  toDisplay : Project | undefined = undefined;
  type = "Unreal Development Kit (UDK)";

  async ngOnInit(): Promise<void> {
    this.initDummyData();
  }

  private initDummyData() {
    const data = projectData;

    this.toDisplay = this.convertToProjectTypes(data).filter(r => r.type == this.type)[0].projects[0];

    console.log(this.toDisplay)
  }

  private convertToProjectTypes(json: any): ProjectType[] {
    const projectTypes: ProjectType[] = [];

    for (const type in json.projects) {
      const projectsArray: Project[] = [];

      for (const projectName in json.projects[type]) {

        const projectData = json.projects[type][projectName];

        const project: Project = {
          name: projectData.name,
          imageUrl: projectData.imageUrl,
          publishedDate: new Date(projectData.publishedDate),
          description: projectData.description,
          downloadLink: projectData.downloadLink
        };

        projectsArray.push(project);
      }

      projectTypes.push({
        type: type,
        projects: projectsArray
      });

    }

    return projectTypes;
  }
}
