import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {ProjectService} from "../../../services/project/project.service";
import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";
import {ProjectType} from "../../../services/entities/ProjectType";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";

@Component({
    selector: 'app-archive',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        NgTemplateOutlet,
        NgForOf,
        NgIf,
        ProjectDisplayComponent
    ],
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit {
  public isLoading: boolean = false;

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

  constructor(private router: Router, private projectTypeService: ProjectTypeService) {
  }

  async ngOnInit(): Promise<void> {
    await this.initDummyData();

    this.selectedFilter = "All"

    this.filterGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 500);
    })
  }

  private async initDummyData() {
    const result = await this.projectTypeService.findAll();

    if(result.statusCode == 200){
      this.projectTypes = result.responseBody;
      this.projectTypesStorage = this.projectTypes;
    }
  }

  private filterProjects(projectName: string) {
    if (this.selectedFilter === "All") {
      this.projectTypes = this.projectTypesStorage;
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

  async navigate(title: string, type: string) {
    const url = `home/${type}/${title}`
    await this.router.navigate([url]);
  }

  public onImageLoad() {
    this.loadedImages++;
    if (this.loadedImages >= this.totalImages + 1) this.isLoading = false;
  }
}
