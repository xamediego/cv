import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  featuredProjects = [
    { title: 'VCTF-Retribution', image: 'assets/projects/R_1.jpg' },
    { title: 'VCTF-Retribution', image: 'assets/projects/R_2.jpg' },
    { title: 'VCTF-Retribution', image: 'assets/projects/R_3.jpg' },
    { title: 'Healthmate', image: 'assets/projects/H_1.jpg' },
    { title: 'Healthmate', image: 'assets/projects/H_2.jpg' },
  ];

  activeIndex = 0;

  ngOnInit() {
    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.featuredProjects.length;
    }, 4000);
  }
}
