import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProjectType} from "./entities/ProjectType";
import {Project} from "./entities/Project";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    NgForOf,
    NgIf
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  projectTypesStorage: ProjectType[] = [];
  projectTypes: ProjectType[] = [];

  selectedFilter: string = "All";

  myGroup: FormGroup<{ inputControl: FormControl<any> }> = new FormGroup({
    inputControl: new FormControl()
  });

  timeoutId: any = null;

  constructor(
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.initDummyData();

    this.selectedFilter = "All"

    this.myGroup.valueChanges.subscribe((v) => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        this.filterProjects(v.inputControl)
      }, 500);

    })
  }

  private initDummyData() {
    // UT2004
    let ut2k4Projects: Project[] = [];

    let imageNames = [
      "TestThumbnails/Unreal Tournament 2004/DM-Dome.jpg",
      "TestThumbnails/Unreal Tournament 2004/DM-Hellzone.jpg",
      "TestThumbnails/Unreal Tournament 2004/DM-Instaltion-486.jpg",
      "TestThumbnails/Unreal Tournament 2004/DM-Legacy.jpg",
      "TestThumbnails/Unreal Tournament 2004/DM-ThePit.jpg",
      "TestThumbnails/Unreal Tournament 2004/DM-VoteFor.jpg"
    ];

    imageNames.forEach(imageUrl => {
      let parts: string[] = imageUrl.split("/");
      let mapName = parts[parts.length - 1].split(".")[0];

      let project: Project = {
        name: mapName,
        imageUrl: imageUrl,
        publishedDate: new Date(),
        description: '',
        downloadLink: '',
        repositoryLink: ''
      }

      ut2k4Projects.push(project)
    });

    let ut2004: ProjectType = {
      id: "3",
      type: "Unreal Tournament 2004",
      projects: ut2k4Projects
    };

    // UT3
    let ut3Projects: Project[] = [];

    imageNames = [
      "TestThumbnails/Unreal Tournament 3/VCTF-Retribution.jpg",
      "TestThumbnails/Unreal Tournament 3/War-Snowbound.jpg",
      "TestThumbnails/Unreal Tournament 3/DM-Esoteric.jpg",
      "TestThumbnails/Unreal Tournament 3/DM-CTF-Element.jpg",
      "TestThumbnails/Unreal Tournament 3/VCTF-District.jpg",
      "TestThumbnails/Unreal Tournament 3/CTF-Crossfire.jpg",
    ];

    imageNames.forEach(imageUrl => {

      let parts: string[] = imageUrl.split("/");
      let mapName = parts[parts.length - 1].split(".")[0];

      let project: Project = {
        name: mapName,
        imageUrl: imageUrl,
        publishedDate: new Date(),
        description: '',
        downloadLink: '',
        repositoryLink: ''
      }

      ut3Projects.push(project)
    });

    let ut3: ProjectType = {
      id: "2",
      type: "Unreal Tournament 3",
      projects: ut3Projects
    };

    // Java
    let javaProjects: Project[] = [];

    imageNames = [
      "TestThumbnails/Java/JFX-ImageCutter.jpg",
      "TestThumbnails/Java/JFX-Game.jpg",
    ];

    imageNames.forEach(imageUrl => {
      let parts: string[] = imageUrl.split("/");
      let mapName = parts[parts.length - 1].split(".")[0];

      let project: Project = {
        name: mapName,
        imageUrl: imageUrl,
        publishedDate: new Date(),
        description: '',
        downloadLink: '',
        repositoryLink: ''
      }

      javaProjects.push(project)
    });

    let java: ProjectType = {
      id: "1",
      type: "Java",
      projects: javaProjects
    };

    this.projectTypes.push(java);
    this.projectTypes.push(ut3);
    this.projectTypes.push(ut2004);

    this.projectTypesStorage = JSON.parse(JSON.stringify(this.projectTypes))
  }

  private filterProjects(projectName: string) {

    if (this.selectedFilter === "All") {
      this.projectTypes = JSON.parse(JSON.stringify(this.projectTypesStorage));
    } else {
      this.projectTypes = JSON.parse(JSON.stringify(this.projectTypesStorage)).filter((pt: ProjectType) => pt.type === this.selectedFilter);
    }

    if (projectName !== "" && projectName !== undefined && projectName !== null) {
      this.projectTypes = this.projectTypes.filter(pt => {
        pt.projects = pt.projects.filter(p => p.name.includes(projectName))
        return pt.projects.length > 0;
      })
    }

    //Fix Date otherwise can use GetFullYear() etc anymore for some weird reason (maybe Javascript is the reason)
    this.projectTypes.map(pt => {
      pt.projects.map(p => {
        p.publishedDate = new Date(p.publishedDate);
      })
    })

  }

}
