import { Component } from '@angular/core';
import {NewProjectFormComponent} from "../../../parts/forms/newproject/new-project-form.component";

@Component({
  selector: 'app-new-project',
    imports: [
        NewProjectFormComponent
    ],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {

}
