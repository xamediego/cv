import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as projectData from '../../../assets/ut-projects.json';
import { MapProject } from './entities/map-project';
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-project',
  standalone: true,
  templateUrl: './project.component.html',
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  public project: MapProject | null = null;
  public selectedImage = '';
  public isSmallScreen: boolean = false;
  private readonly smallScreenSize: number = 920;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;

    this.route.paramMap.subscribe(async params => {
      const title = params.get('title') || '';
      this.project = await this.loadData(title);

      if (this.project) {
        this.selectedImage = this.project.images[0];
      }
    });
  }

  changePicture(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  private async loadData(projectName: string): Promise<MapProject | null> {
    const data: any = projectData;
    return this.mapData(data, projectName);
  }

  private mapData(json: any, title: string): MapProject | null {
    return json.projects.find((proj: MapProject) => proj.title === title) || null;
  }

  @HostListener('window:resize')
  onResize() {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;
  }
}
