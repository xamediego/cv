import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as projectData from '../../../assets/ut-projects.json';
import {MapProject} from './entities/map-project';
import {IMAGE_CONFIG, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-project',
  standalone: true,
  templateUrl: './project.component.html',
  imports: [
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    NgOptimizedImage
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

  public images: HTMLImageElement[] = [];

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;

    this.route.paramMap.subscribe(async params => {
      const title = params.get('title') || '';
      this.project = await this.loadData(title);


      if (this.project) {
        this.loadImages(this.project.images)
      }
    });

    this.isLoading = await this.imagesLoaded(this.images)

    setTimeout(() => {
      const imageHolder = document.getElementById("image-0")

      if (imageHolder) this.changePicture(imageHolder, this.images[0].src)
    })
  }

  protected changePictureEvent($event: MouseEvent, imageUrl: any) {
    const element = ($event.currentTarget as HTMLElement) ?? null;
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
      if (toClear) toClear.classList.remove('imageHolder__holder--active');
    }

    element.classList.add('imageHolder__holder--active');

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

  @HostListener('window:resize')
  onResize() {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;

    const mainImageElement = document.getElementById("main-image") as HTMLElement | null;
    const imageHolderElement = document.getElementById("image-holder") as HTMLElement | null;

    if (mainImageElement && imageHolderElement) {
      const mainImageWidth = mainImageElement.offsetWidth;
      const holderWidth = imageHolderElement.offsetWidth;

      if (holderWidth > mainImageWidth) {
        imageHolderElement.style.overflowX = "hidden";
        imageHolderElement.style.flexWrap = "wrap";
      } else {
        imageHolderElement.style.removeProperty('overflow-x');
        imageHolderElement.style.removeProperty('flex-wrap');
      }
    }
  }

  private loadImages(imageUrls: String[]) {
    const images: HTMLImageElement[] = imageUrls.map(imageUrl => {
      const image: HTMLImageElement = document.createElement("img")
      // @ts-ignore
      image.src = imageUrl;
      image.loading = "eager";
      return image
    });

    this.setSmallImages(images);
  }

  private setSmallImages(images: HTMLImageElement[]) {
    this.images = [...images.map(image => {
      image.complete
      return image;
    })]
  }

  private async imagesLoaded(images: HTMLImageElement[]): Promise<boolean> {
    const loadPromises = images.map(img => {
      return new Promise<boolean>(resolve => {
        if (img.complete && img.naturalWidth !== 0) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        }
      });
    });
    let results = await Promise.all(loadPromises);

    return results.every(loaded => loaded);
  }
}
