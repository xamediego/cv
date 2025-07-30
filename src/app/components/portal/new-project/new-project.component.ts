import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {UploadFormComponent} from "../../../parts/forms/uploadform/upload-form.component";
import {environment} from "../../../../environments/environment";
import {ProjectUploadSummary} from "../../../services/generic/entities/file.upload.summary";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {ProjectType} from "../../../services/entities/project.type";

@Component({
  selector: 'app-new-project',
  imports: [
    UploadFormComponent
  ],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent implements OnInit{

  public projectTypes : ProjectType[] = [];
  public projectTypeType : string = "";
  public apiLink: string = "";

  constructor(private route : ActivatedRoute, private router : Router) {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      this.projectTypeType = params.get('type') || '';
      this.apiLink = `${environment.MainApi}/project/upload/${this.projectTypeType}`
    });
  }

  public onUploadFinished: (response: FetchResponse<ProjectUploadSummary>) => void = async (response) => {
    if(response.statusCode == 200){
      const project = response.responseBody.projects[0];

      const route = `project/new/${this.projectTypeType}/${project.title}`;
      await this.router.navigate([route] , {state : project})
    }
  }
}
