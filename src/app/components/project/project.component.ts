import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IMAGE_CONFIG, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ProjectService} from "../../services/project.service";
import {Project} from "../../services/project";

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

  public project: Project | null = null;

  public selectedImageUrl = '';
  public selectedImageId = "";

  public isSmallScreen: boolean = false;
  private readonly smallScreenSize: number = 920;

  totalImages: number = 0;
  loadedImages: number = 0;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {
  }

  async ngOnInit(): Promise<void> {
    this.isSmallScreen = window.innerWidth < this.smallScreenSize;

    this.route.paramMap.subscribe(async params => {
      const title = params.get('title') || '';
      this.project = await this.loadData(title);

      this.totalImages = (this.project?.images ? this.project.images.length : 0) + 1
    });

    setTimeout(() => {
      const imageHolder = document.getElementById("image-0")

      if (imageHolder) this.changePicture(imageHolder, this.project?.images[0])

      this.checkImageHolderSize();
    })
  }

  protected changePictureEvent(idNumber: number, imageUrl: any) {
    const element = document.getElementById("image-" + idNumber)
    if (!element) return;
    this.changePicture(element, imageUrl)
  }

  private changePicture(element: Element, imageUrl: any) {
    this.scrollTo(element)

    if (this.selectedImageId != "") {
      const toClear = document.getElementById(this.selectedImageId);
      if (toClear) toClear.classList.remove('imageHolder__image--active');
    }

    element.classList.add('imageHolder__image--active');

    this.selectedImageId = element.id;
    this.selectedImageUrl = imageUrl;
  }

  private scrollTo(element: Element) {
    const imageHolder = element.parentElement;
    const imageScroller = document.getElementById("image-holder")

    if (imageScroller && imageHolder) {
      const parentRect = imageScroller.getBoundingClientRect();
      const elementRect = imageHolder.getBoundingClientRect();

      const parentScrollLeft = imageScroller.scrollLeft;
      const offset = elementRect.left - parentRect.left;
      const scrollTo = offset - imageScroller.clientWidth / 2 + imageHolder.clientWidth / 2;

      imageScroller.scrollTo({
        left: parentScrollLeft + scrollTo,
        behavior: 'smooth',
      });
    }
  }

  private async loadData(projectName: string): Promise<Project | null> {
    return this.projectService.findByTitle(projectName)
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

  private checkImageHolderSize() {
    const mainImageElement = document.getElementById("main-image") as HTMLElement | null;
    const imageHolderElement = document.getElementById("image-holder") as HTMLElement | null;

    if (mainImageElement && imageHolderElement) {
      const mainImageWidth = mainImageElement.offsetWidth;
      const holderWidth = imageHolderElement.offsetWidth;

      if (holderWidth > (mainImageWidth + 10)) {
        imageHolderElement.style.overflowX = "hidden";
        imageHolderElement.style.padding = "3px"
      } else {
        imageHolderElement.style.removeProperty('overflow-x');
      }
    }
  }
}
