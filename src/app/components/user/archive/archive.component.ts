import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {ProjectService} from "../../../services/project/project.service";
import {ProjectType} from "../../../services/project/project";

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    NgForOf,
    NgIf
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

  constructor(private router: Router, private projectService: ProjectService) {
  }

  async ngOnInit(): Promise<void> {
    this.initDummyData();

    this.selectedFilter = "All"

    this.filterGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 500);
    })
  }

  private initDummyData() {
    this.projectTypes = this.projectService.findAll();
    this.projectTypesStorage = this.projectTypes
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
        p.date = new Date(p.date);
      })
    })
  }

  async navigate(title: string, type: string) {
    const url = `project/${type}/${title}`
    await this.router.navigate([url]);
  }

  public onImageLoad() {
    this.loadedImages++;
    if (this.loadedImages >= this.totalImages + 1) this.isLoading = false;
  }
}
