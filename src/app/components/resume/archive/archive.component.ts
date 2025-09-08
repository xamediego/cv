import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

import {ProjectType} from "../../../services/entities/project.type";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {Project} from "../../../services/entities/project";
import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";

@Component({
  selector: 'app-archive',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ProjectDisplayComponent,
  ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit {
  contentLoaded: boolean = false;
  projectTypes: ProjectType[] = [];

  constructor(private projectTypeService: ProjectTypeService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
  }

  public async ngOnInit(): Promise<void> {
    await this.loadProjects();
  }

  private async loadProjects() {
    this.contentLoaded = false;
    const result = await this.projectTypeService.findAllComplete();

    if (result.statusCode == 200) this.projectTypes = result.responseBody;

    this.contentLoaded = true
    this.cdr.markForCheck();
  }
}
