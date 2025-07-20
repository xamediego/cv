import {Component, HostListener, OnInit} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

@Component({
    selector: 'app-cv',
    imports: [
        NgTemplateOutlet,
    ],
    templateUrl: './cv.component.html',
    styleUrl: './cv.component.scss'
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
