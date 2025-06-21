import {Injectable} from '@angular/core';
import {Project} from "./project";
import * as projectData from "../../../assets/projects.json";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor() { }

  findAll(){
    return this.loadData()
  }

  findByType(type : String){
    return this.loadData()["type"];
  }

  findByTitle(title : String) : Project | null{
    const data = this.loadData()

    for (const category in data) {
      if (Array.isArray(data[category])) {
        const project = data[category].find(proj => proj.title === title);

        if (project) {
          return  project ;
        }
      }
    }

    return null;
  }

  private loadData(): any {
    const data = projectData.projects["project-types"];
    console.log("Data:")
    console.log(data)
    return data;
  }
}
