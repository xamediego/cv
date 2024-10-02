import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProjectType} from "./entities/ProjectType";
import {Project} from "./entities/Project";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import * as projectData from '../../../assets/projects.json';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    NgForOf,
    NgIf
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  projectTypesStorage: ProjectType[] = [];
  projectTypes: ProjectType[] = [];

  selectedFilter: string = "All";

  filterGroup: FormGroup<{
    inputControl: FormControl<any>,
    selectControl : FormControl<any> }> =
    new FormGroup({
      inputControl: new FormControl(),
      selectControl: new FormControl,
    });

  timeoutId: any = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.initDummyData();

    this.selectedFilter = "All"

    this.filterGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 500);
    })
  }

  private initDummyData() {
    const data = projectData;

    const projectTypes = this.convertToProjectTypes(data);
    projectTypes.forEach(pt => this.projectTypes.push(pt))

    this.projectTypesStorage = JSON.parse(JSON.stringify(this.projectTypes))
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

  private filterProjects(projectName: string) {

    if (this.selectedFilter === "All") {
      this.projectTypes = JSON.parse(JSON.stringify(this.projectTypesStorage));
    } else {
      this.projectTypes = JSON.parse(JSON.stringify(this.projectTypesStorage)).filter((pt: ProjectType) => pt.type === this.selectedFilter);
    }

    if (projectName !== "" && projectName !== undefined && projectName !== null) {
      this.projectTypes = this.projectTypes.filter(pt => {
        pt.projects = pt.projects.filter(p => p.name.includes(projectName))
        return pt.projects.length > 0;
      })
    }

    //Fix Date otherwise can use GetFullYear() etc anymore for some weird reason (maybe Javascript is the reason)
    this.projectTypes.map(pt => {
      pt.projects.map(p => {
        p.publishedDate = new Date(p.publishedDate);
      })
    })
  }

}
