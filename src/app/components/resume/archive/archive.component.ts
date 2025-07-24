import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgStyle, NgTemplateOutlet} from "@angular/common";

import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";
import {ProjectType} from "../../../services/entities/project.type";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {EventSpinnerDirective} from "../../../parts/event-spinner.directive";
import {Router} from "@angular/router";

@Component({
  selector: 'app-archive',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    ProjectDisplayComponent,
    EventSpinnerDirective,
    NgStyle
  ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit {
  imagesLoaded : boolean = false;
  contentLoaded : boolean = false;

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

  constructor(private projectTypeService: ProjectTypeService, private router : Router) {}

  async ngOnInit(): Promise<void> {
    await this.loadProjects();

    this.projectTypes.forEach(pt => pt.projects.forEach(p => this.totalImages += 1));

    this.selectedFilter = "All"

    this.filterGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 0);
    })
  }

  navigate : (title: string, type: string) => void = async (title, type) => {
    const url = `home/${type}/${title}`

    await this.router.navigate([url]);
  }

  private async loadProjects() {
    this.contentLoaded = false;

    const result = await this.projectTypeService.findAllComplete();

    if(result.statusCode == 200){
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

  public onImagesLoad(){
    this.loadedImages += 1;
    if(this.loadedImages == this.totalImages) this.imagesLoaded = true;
  }

  public isLoaded() : boolean{
    return this.imagesLoaded && this.contentLoaded;
  }
}
