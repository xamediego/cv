import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {ProjectFormComponent} from "../../../parts/forms/projectform/project-form.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../../services/project/project.service";
import {Project} from "../../../services/entities/project";
import {ProjectType} from "../../../services/entities/project.type";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";


@Component({
  selector: 'app-edit-project',
  imports: [
    ProjectFormComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {

  @Input() public project: Project | undefined;
  public projectTypes: ProjectType[] = [];

  public projectTypeType: string = "";
  public projectTitle: string = "";

  constructor(private _location: Location, private route: ActivatedRoute, private router: Router, private projectService: ProjectService, private projectTypeService: ProjectTypeService) {}

  public async ngOnInit() {
    // @ts-ignore
    this.project = this._location.getState().project;

    this.route.paramMap.subscribe(async params => {
      this.projectTypeType = params.get('type') || '';
      this.projectTitle = params.get('title') || '';

      if (!this.project) await this.getProjectByTitle(this.projectTitle);

      await this.getProjectTypes();
    });
  }

  public async getProjectTypes() {
    const result = await this.projectTypeService.findAll();
    return result.statusCode == 200 ? result.responseBody : [];
  }

  private async getProjectByTitle(title: string) {
    const result = await this.projectService.findByTitle(title);
    if (result.statusCode == 200) this.project = result.responseBody;
  }

  public closeView: () => void = async () => {
    const route = `home/project/${this.projectTypeType}`
    await this.router.navigate([route])
  }
}
