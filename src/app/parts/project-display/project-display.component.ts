import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';

import {ProjectDto} from "../../services/entities/project.dto";
import {ProjectTypeDto} from "../../services/entities/project-type.dto";

@Component({
    selector: 'project-holder',
    templateUrl: './project-display.component.html',
    styleUrls: ['./project-display.component.scss'],
    imports: []
})
export class ProjectDisplayComponent{

  @Input() project: ProjectDto | null = null;
  @Input() projectType: ProjectTypeDto | null = null;
  @Output() loaded : EventEmitter<boolean> = new EventEmitter();

  constructor(private router : Router) {}

  async navigate(title: string, type: string) {
    const url = `home/${type}/${title}`

    await this.router.navigate([url]);
  }

  onImageLoad() {
    this.loaded.emit(true);
  }

  createProjectString(publishedDate: Date) {
    const date = new Date(publishedDate);

    return `Created:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}
