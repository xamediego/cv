import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';

import {Project} from "../../services/entities/project";
import {ProjectType} from "../../services/entities/project.type";

@Component({
    selector: 'project-holder',
    templateUrl: './project-display.component.html',
    styleUrls: ['./project-display.component.scss'],
    imports: []
})
export class ProjectDisplayComponent{

  @Input() project: Project | null = null;
  @Input() projectType: ProjectType | null = null;
  @Input() onSelect : (title: string, type: string) => void = () => {};
  @Output() loaded : EventEmitter<boolean> = new EventEmitter();

  onImageLoad() {this.loaded.emit(true);}

  createProjectString(publishedDate: Date) {
    const date = new Date(publishedDate);

    return `Created:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}
