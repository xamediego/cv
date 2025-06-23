import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

import {ProjectDisplayComponent} from "../../../parts/project-display/project-display.component";
import {ProjectType} from "../../../services/entities/ProjectType";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";

@Component({
    selector: 'app-type',
    imports: [
        NgIf,
        NgOptimizedImage,
        NgForOf,
        ProjectDisplayComponent
    ],
    templateUrl: './type.component.html',
    styleUrl: './type.component.scss'
})
export class TypeComponent implements OnInit {

  public isLoading: boolean = false;

  public projectType: ProjectType | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private projectTypeService: ProjectTypeService) {
  }

  async ngOnInit(): Promise<void> {

    this.route.paramMap.subscribe(async params => {
      const type = params.get('type') || '';

      await this.loadData(type);
    });
  }

  private async loadData(type : string){
    const result = await this.projectTypeService.findByType(type);
    if(result.statusCode == 200){
      this.projectType = result.responseBody
    }
  }
}
