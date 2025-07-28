import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {NgStyle, NgTemplateOutlet} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

import {EventSpinnerDirective} from "../event-spinner.directive";
import {ProjectHolderComponent} from "../project-holder/project-holder.component";

import {ProjectType} from "../../services/entities/project.type";
import {Project} from "../../services/entities/project";

@Component({
  selector: 'project-display',
  imports: [
    ProjectHolderComponent,
    ReactiveFormsModule,
    NgStyle,
    EventSpinnerDirective,
    NgTemplateOutlet

  ],
  templateUrl: './project-display.component.html',
  styleUrl: './project-display.component.scss'
})
export class ProjectDisplayComponent implements OnInit, OnChanges{
  @Input() onProjectSelect: (projectType: ProjectType, project: Project) => void = () => {};

  @Input() projectTypes: ProjectType[] = [];
  projectTypesStorage: ProjectType[] = [];

  isEditing: boolean = false;
  projectToEdit: Project | undefined;

  selectedFilter: string = "All";

  imagesLoaded: boolean = false;
  @Input() contentLoaded!: boolean;

  totalImages: number = 0;
  loadedImages: number = 0;

  filterGroup: FormGroup<{
    inputControl: FormControl<any>,
    selectControl: FormControl<any>
  }> =
    new FormGroup({
      inputControl: new FormControl(),
      selectControl: new FormControl,
    });

  timeoutId: any = null;

  public async ngOnInit() {
    this.configureView();

    this.selectedFilter = "All"

    this.filterGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 0);
    })
  }

  public ngOnChanges(): void {
    this.configureView();
  }

  private configureView(){
    this.projectTypesStorage = JSON.parse(JSON.stringify(this.projectTypes))
    this.projectTypes.forEach(pt => pt.projects.forEach(p => this.totalImages += 1));
  }

  public viewEdit: (project: Project) => void = (project) => {
    this.isEditing = true;
    this.projectToEdit = project;
  }

  private filterProjects(projectName: string) {
    if (this.selectedFilter === "All") {
      this.projectTypes = JSON.parse(JSON.stringify(this.projectTypesStorage))
    } else {
      this.projectTypes = this.projectTypesStorage.filter((pt: ProjectType) => pt.type == this.selectedFilter);
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
