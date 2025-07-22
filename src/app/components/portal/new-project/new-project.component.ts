import { Component } from '@angular/core';
import {UploadFormComponent} from "../../../parts/forms/uploadform/upload-form.component";

@Component({
  selector: 'app-new-project',
    imports: [
        UploadFormComponent
    ],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {

}
