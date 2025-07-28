import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Project} from "../../services/entities/project";
import {ProjectType} from "../../services/entities/project.type";

@Component({
    selector: 'project-holder',
    templateUrl: './project-holder.component.html',
    styleUrls: ['./project-holder.component.scss'],
    imports: []
})
export class ProjectHolderComponent {

  @Input() project: Project | null = null;
  @Input() projectType: ProjectType | null = null;
  @Input() onProjectSelect : (projectType: ProjectType, project: Project) => void = () => {};
  @Output() loaded : EventEmitter<boolean> = new EventEmitter();

  @Input() editable: boolean = false;
  @Input() onEdit: (projectType: ProjectType, project: Project) => void = () => {};

  onImageLoad() {this.loaded.emit(true);}

  createProjectString(publishedDate: Date) {
    const date = new Date(publishedDate);
    return `Created:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}
