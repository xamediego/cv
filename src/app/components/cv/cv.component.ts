import {Component, HostListener, OnInit} from '@angular/core';
import {NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgIf
  ],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent implements OnInit{

  isSmallScreen: boolean = false;
  smallScreen : number = 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < this.smallScreen;
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth < this.smallScreen; // Initial check
  }
}
