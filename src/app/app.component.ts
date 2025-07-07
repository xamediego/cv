import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ThemeService} from "./services/generic/theme.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  constructor(private themeService : ThemeService) {}

  ngOnInit(): void {


    if (window.matchMedia) {
      if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        console.log("Set Dark")
        this.themeService.setTheme('dark')
      } else {
        console.log("Set Light")
        this.themeService.setTheme('light')
      }
    } else {
      this.themeService.setTheme('dark')
    }
  }
}


