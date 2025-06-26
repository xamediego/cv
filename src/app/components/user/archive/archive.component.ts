import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgTemplateOutlet} from "@angular/common";

import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";
import {ProjectTypeDto} from "../../../services/entities/ProjectTypeDto";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";

@Component({
    selector: 'app-archive',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    ProjectDisplayComponent,
    EventSpinnerDirective
  ],
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit {
  imagesLoaded : boolean = false;
  contentLoaded : boolean = false;


  projectTypesStorage: ProjectTypeDto[] = [];
  projectTypes: ProjectTypeDto[] = [];

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

  constructor(private projectTypeService: ProjectTypeService) {
  }

  async ngOnInit(): Promise<void> {
    await this.initDummyData();

    this.projectTypes.forEach(pt => pt.projects.forEach(p => this.totalImages += 1));

    this.selectedFilter = "All"

    this.filterGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 500);
    })
  }

  private async initDummyData() {
    const result = await this.projectTypeService.findAllComplete();

    if(result.statusCode == 200){
      this.projectTypes = result.responseBody;
      this.projectTypesStorage = this.projectTypes;
    }

    this.contentLoaded = true;
  }

  private filterProjects(projectName: string) {
    if (this.selectedFilter === "All") {
      this.projectTypes = this.projectTypesStorage;
    } else {
      this.projectTypes = this.projectTypesStorage.filter((pt: ProjectTypeDto) => pt.title == this.selectedFilter);
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

  public onImagesLoad(){
    this.loadedImages += 1;
    if(this.loadedImages == this.totalImages) this.imagesLoaded = true;
  }

  public isLoaded() : boolean{
    return this.imagesLoaded && this.contentLoaded;
  }
}
