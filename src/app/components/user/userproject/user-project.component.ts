import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {ProjectType} from "../../../services/entities/project.type";
import {ReactiveFormsModule} from "@angular/forms";
import {PortalHeaderComponent} from "../../portal/portal-header/portal.header.component";
import {UserService} from "../../../services/generic/user.service";
import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";
import {Project} from "../../../services/entities/project";


@Component({
  selector: 'app-project',
  templateUrl: './user-project.component.html',
  imports: [
    ReactiveFormsModule,
    PortalHeaderComponent,
    ProjectDisplayComponent

  ],
  styleUrls: ['./user-project.component.scss']
})
export class UserProjectComponent implements OnInit {
  contentLoaded: boolean = false;
  projectTypes: ProjectType[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectTypeService: ProjectTypeService,
    private userService: UserService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const username = params.get('username') || '';

      if (this.userService.getUsernameFromJwt() === username) {
        await this.loadPersonalData();
      } else {
        await this.loadUserData(username);
      }
    });
  }

  private async loadPersonalData() {
    this.contentLoaded = false;
    const result = await this.projectTypeService.findPersonal();
    if (result.statusCode === 200) this.projectTypes = result.responseBody;
    this.contentLoaded = true;
  }

  private async loadUserData(username: string) {
    this.contentLoaded = false;
    const result = await this.projectTypeService.findByUsername(username);
    if (result.statusCode === 200) this.projectTypes = result.responseBody;
    this.contentLoaded = true;
  }

  public onProjectSelect: (projectType: ProjectType, project: Project) => void = () => {};
}
