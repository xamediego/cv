import {Component, OnInit} from '@angular/core';
import {UploadFormComponent} from "../../../parts/forms/uploadform/upload-form.component";
import {environment} from "../../../../environments/environment";
import {ProjectUploadSummary} from "../../../services/generic/entities/file.upload.summary";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {Project} from "../../../services/entities/project";
import {ProjectFormComponent} from "../../../parts/forms/projectform/project-form.component";
import {ProjectType} from "../../../services/entities/project.type";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-new-project',
  imports: [
    UploadFormComponent,
    ProjectFormComponent
  ],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent implements OnInit{

  public uploadFinished: boolean = false;
  public newProject: Project | undefined;
  public projectTypes : ProjectType[] = [];
  public projectTypeType : string = "";
  public apiLink: string = "";

  constructor(private projectTypeService: ProjectTypeService, private route : ActivatedRoute) {}

  async ngOnInit(): Promise<void> {

    this.route.paramMap.subscribe(async params => {
      this.projectTypeType = params.get('type') || '';
      this.apiLink = `${environment.MainApi}/project/upload/${this.projectTypeType}`
    });
  }

  public onUploadFinished: (response: FetchResponse<ProjectUploadSummary>) => void = async (response) => {
    this.projectTypes = await this.getProjectTypes();
    this.newProject = response.responseBody.projects[0];
  }

  public getProjectTypes:  () => Promise<ProjectType[]> = async () => {
    const result = await this.projectTypeService.findAll();

    return result.statusCode == 200 ? result.responseBody : [];
  }
}
