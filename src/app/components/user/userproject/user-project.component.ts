import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {ProjectType} from "../../../services/entities/project.type";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {NgStyle, NgTemplateOutlet} from "@angular/common";
import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ProjectFormComponent} from "../../../parts/forms/projectform/project-form.component";
import {Project} from "../../../services/entities/project";
import {PortalHeaderComponent} from "../../portal/portal-header/portal.header.component";


@Component({
  selector: 'app-project',
  templateUrl: './user-project.component.html',
  imports: [
    EventSpinnerDirective,
    NgTemplateOutlet,
    ProjectDisplayComponent,
    ReactiveFormsModule,
    NgStyle,
    ProjectFormComponent,
    PortalHeaderComponent

  ],
  styleUrls: ['./user-project.component.scss']
})
export class UserProjectComponent implements OnInit {

  isEditing: boolean = false;
  projectToEdit: Project | undefined;

  imagesLoaded: boolean = false;
  contentLoaded: boolean = false;

  projectTypesStorage: ProjectType[] = [];
  projectTypes: ProjectType[] = [];

  totalImages: number = 0;
  loadedImages: number = 0;

  selectedFilter: string = "All";

  filterGroup: FormGroup<{
    inputControl: FormControl<any>,
    selectControl: FormControl<any>
  }> =
    new FormGroup({
      inputControl: new FormControl(),
      selectControl: new FormControl,
    });

  timeoutId: any = null;

  constructor(private route: ActivatedRoute, private projectTypeService: ProjectTypeService) {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const username = params.get('username') || '';
      await this.loadData(username);

      this.projectTypes.forEach(pt => pt.projects.forEach(p => this.totalImages += 1));
    });

    this.selectedFilter = "All"

    this.filterGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 0);
    })
  }

  viewEdit: (title: string, type: string) => void = (title, type) => {
    const r = this.projectTypes.map(pt => {
      pt.projects = pt.projects.filter(p => p.title == (title))
      return pt.projects;
    }).flatMap(p => p);

    if(r.length > 0) {
      this.isEditing = true;
      this.projectToEdit = r[0]
    }
  }

  closeEdit : () => void = () => {
    this.isEditing = false;
    this.projectToEdit = undefined;
  }

  private async loadData(username: any) {
    this.contentLoaded = false;

    const result = await this.projectTypeService.findByUsername(username, true, true)
    if (result.statusCode == 200) {
      this.projectTypes = result.responseBody;
      this.projectTypesStorage = JSON.parse(JSON.stringify(this.projectTypes))
    }

    this.contentLoaded = true;
  }

  private filterProjects(projectName: string) {
    if (this.selectedFilter === "All") {
      this.projectTypes = JSON.parse(JSON.stringify(this.projectTypesStorage))
    } else {
      this.projectTypes = this.projectTypesStorage.filter((pt: ProjectType) => pt.title == this.selectedFilter);
    }

    if (projectName !== "" && projectName !== undefined && projectName !== null) {
      this.projectTypes = this.projectTypes.filter(pt => {
        pt.projects = pt.projects.filter(p => p.title.includes(projectName))
        return pt.projects.length > 0;
      })
    }

    this.projectTypes.map(pt => {
      pt.projects.map(p => {
        p.publishedDate = new Date(p.publishedDate);
      })
    })
  }

  public onImagesLoad() {
    this.loadedImages += 1;
    if (this.loadedImages == this.totalImages) this.imagesLoaded = true;
  }

  public isLoaded(): boolean {
    return this.imagesLoaded && this.contentLoaded;
  }
}
