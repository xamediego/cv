import {Component, HostListener, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgTemplateOutlet,
    NgIf
  ],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss'
})
export class CvComponent implements OnInit{

  isSmallScreen: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 600;
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth < 600; // Initial check
  }

}
