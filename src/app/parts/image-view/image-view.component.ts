import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-image-view',
  standalone: true,
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
  imports: [NgTemplateOutlet],
})
export class ImageViewComponent implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  @Input() showNavigationButton = false;
  @Input() showImageList = false;
  @Input() useInterval = false;
  @Input() interval = 5000;

  @Output() initialImageLoadedChange = new EventEmitter<void>();
  @Output() allImagesLoadedChange = new EventEmitter<void>();

  selectedImageUrl = '';
  selectedImageIndex = 0;
  initialImageLoaded = false;
  imagesLoaded = false;

  private totalImages = 0;
  private loadedImages = 0;
  private intervalTimer: any;

  ngOnInit(): void {
    this.totalImages = this.images.length;
    this.selectedImageUrl = this.images[0];

    if (this.useInterval) {
      this.startImageRotation();
    }
  }

  ngOnDestroy(): void {
    this.stopImageRotation();
  }

  onImageLoad(): void {
    this.loadedImages++;

    if (!this.initialImageLoaded) {
      this.setActiveImage(0);
      this.initialImageLoaded = true;
      this.initialImageLoadedChange.emit();
    }

    if (this.loadedImages === this.totalImages) {
      this.imagesLoaded = true;
      this.allImagesLoadedChange.emit();
    }
  }

  onThumbnailClick(index: number, imageUrl: string): void {
    this.changeImage(index, imageUrl);
  }

  previous(): void {
    const newIndex = this.selectedImageIndex === 0
      ? this.images.length - 1
      : this.selectedImageIndex - 1;

    this.changeImage(newIndex, this.images[newIndex]);
  }

  next(): void {
    const newIndex = this.selectedImageIndex === this.images.length - 1
      ? 0
      : this.selectedImageIndex + 1;

    this.changeImage(newIndex, this.images[newIndex]);
  }

  private changeImage(index: number, imageUrl: string): void {
    this.removeActiveClassFromImage(this.selectedImageIndex);
    this.scrollToImage(index);
    this.setActiveImage(index);

    this.selectedImageIndex = index;
    this.selectedImageUrl = imageUrl;

    this.triggerFadeEffect();

    if (this.useInterval) {
      this.stopImageRotation();
      this.startImageRotation();
    }
  }

  private triggerFadeEffect(): void {
    const element = document.getElementById('main-image');
    if (!element) return;

    element.classList.add('fade-in');
    setTimeout(() => element.classList.remove('fade-in'), 200);
  }

  private setActiveImage(index: number): void {
    this.getImageElement(index)?.classList.add('imageHolder__image--active');
  }

  private removeActiveClassFromImage(index: number): void {
    this.getImageElement(index)?.classList.remove('imageHolder__image--active');
  }

  private scrollToImage(index: number): void {
    const imageElement = this.getImageElement(index)?.parentElement;
    const container = document.getElementById('image-holder');
    if (!imageElement || !container) return;

    const parentRect = container.getBoundingClientRect();
    const elementRect = imageElement.getBoundingClientRect();
    const scrollOffset = elementRect.left - parentRect.left
      - container.clientWidth / 2
      + imageElement.clientWidth / 2;

    container.scrollTo({
      left: container.scrollLeft + scrollOffset,
      behavior: 'smooth',
    });
  }

  private getImageElement(index: number): HTMLElement | null {
    return document.getElementById(this.getImageId(index));
  }

  private getImageId(index: number): string {
    return `image-${index}`;
  }

  private startImageRotation(): void {
    this.intervalTimer = setInterval(() => this.next(), this.interval);
  }

  private stopImageRotation(): void {
    clearInterval(this.intervalTimer);
  }
}
