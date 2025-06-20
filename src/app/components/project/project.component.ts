import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as projectData from '../../../assets/ut-projects.json';
import {MapProject} from './entities/map-project';
import {IMAGE_CONFIG, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-project',
  standalone: true,
  templateUrl: './project.component.html',
  imports: [
    NgForOf,
    NgIf,
    NgTemplateOutlet
  ],
  styleUrls: ['./project.component.scss'],
  providers: [{
    provide: IMAGE_CONFIG,
    useValue: {breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]}
  },],
})
export class ProjectComponent implements OnInit {
  public isLoading: boolean = false;

  public project: MapProject | null = null;

  public selectedImageUrl = '';
  public selectedImageId = "";

  public isSmallScreen: boolean = false;
  private readonly smallScreenSize: number = 920;

  totalImages: number = 0;
  loadedImages: number = 0;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;

    this.route.paramMap.subscribe(async params => {
      const title = params.get('title') || '';
      this.project = await this.loadData(title);

      this.totalImages = this.project?.images ? this.project.images.length : 0
    });

    setTimeout(() => {
      const imageHolder = document.getElementById("image-0")

      if (imageHolder) this.changePicture(imageHolder, this.project?.images[0])

      this.checkImageHolderSize();
    })
  }

  protected changePictureEvent(idNumber : number, imageUrl: any) {
    const element = document.getElementById("image-" + idNumber)
    if (!element) return;
    this.changePicture(element, imageUrl)
  }

  private changePicture(element: Element, imageUrl: any) {
    element.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });

    if(this.selectedImageId != ""){
      const toClear = document.getElementById(this.selectedImageId);
      if (toClear) toClear.classList.remove('imageHolder__image--active');
    }

    element.classList.add('imageHolder__image--active');

    this.selectedImageId = element.id;
    this.selectedImageUrl = imageUrl;
  }

  private async loadData(projectName: string): Promise<MapProject | null> {
    const data: any = projectData;

    return this.mapData(data, projectName);
  }

  private mapData(json: any, title: string): MapProject | null {
    return json.projects.find((proj: MapProject) => proj.title === title) || null;
  }

  public onImageLoad() {
    this.loadedImages++;
    if (this.loadedImages >= this.totalImages + 1) this.isLoading = false;
  }

  @HostListener('window:resize')
  public onResize() {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;
    this.checkImageHolderSize();
  }

  private checkImageHolderSize(){
    const mainImageElement = document.getElementById("main-image") as HTMLElement | null;
    const imageHolderElement = document.getElementById("image-holder") as HTMLElement | null;

    if (mainImageElement && imageHolderElement) {
      const mainImageWidth = mainImageElement.offsetWidth;
      const holderWidth = imageHolderElement.offsetWidth;

      if (holderWidth > mainImageWidth) {
        console.log("Set overflow")
        // imageHolderElement.style.overflowX = "hidden";
        // imageHolderElement.style.flexWrap = "wrap";
        imageHolderElement.style.padding = "3px"
      } else {
        imageHolderElement.style.removeProperty('overflow-x');
        imageHolderElement.style.removeProperty('flex-wrap');
      }
    }
  }

  protected readonly statusbar = statusbar;
}
