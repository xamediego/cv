import {Injectable} from '@angular/core';
import {Project, ProjectType} from "./project";
import * as projectData from "../../../assets/projects.json";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor() {
  }

  findAll(): ProjectType[] {
    return this.loadData()
  }

  findByTitle(title: String): Project | null {
    const data = this.loadData()
    return data.map(r => r.projects.filter(p => p.title == title)).flat()[0];
  }

  private convertToProjectTypes(json: any): ProjectType[] {
    const projectTypes: ProjectType[] = [];
    for (const type in json) {
      const projectType: ProjectType = json[type];
      projectType.projects.map(p => {
        p.date = new Date(p.date)
        return p;
      })
      projectTypes.push(projectType);
    }
    return projectTypes;
  }

  private loadData(): ProjectType[] {
    const data = projectData.projects["project-types"];
    return this.convertToProjectTypes(data);
  }
}
