import { Component } from '@angular/core';
import {NgOptimizedImage, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgTemplateOutlet
  ],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss'
})
export class CvComponent {

}
