import { Component } from '@angular/core';
import {ThemeService} from "../../../services/generic/theme.service";

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  constructor(private themeService : ThemeService) {}

  changeTheme() {this.themeService.toggleTheme()}
}
