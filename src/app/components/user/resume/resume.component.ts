import {Component, HostListener, OnInit} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

@Component({
    selector: 'app-resume',
    imports: [
        NgTemplateOutlet,
    ],
    templateUrl: './resume.component.html',
    styleUrl: './resume.component.scss'
})
export class ResumeComponent implements OnInit{

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
