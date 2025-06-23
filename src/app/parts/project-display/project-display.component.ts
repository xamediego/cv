import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Project, ProjectType} from "../../services/entities/Project";
import {NgIf} from "@angular/common";

@Component({
  selector: 'project-holder',
  standalone: true,
  templateUrl: './project-display.component.html',
  styleUrls: ['./project-display.component.scss'],
  imports: [
    NgIf
  ]
})
export class ProjectDisplayComponent{

  @Input() project: Project | null = null;
  @Input() projectType: ProjectType | null = null;

  constructor(private router : Router) {}

  async navigate(title: string, type: string) {
    const url = `home/${type}/${title}`
    await this.router.navigate([url]);
  }

  onImageLoad() {

  }
}
