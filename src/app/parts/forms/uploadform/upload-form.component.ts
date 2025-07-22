import {Component, Input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';

import {FormComponent} from "../form.component";
import {ProjectService} from "../../../services/project/project.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {formatBytes, progressTextDots} from "../../../tools/RandomStuff";

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet, EventSpinnerDirective],
  templateUrl: 'upload-form.component.html',
  styleUrls: [
    '../form.component.scss',
    'upload-form.component.scss']
})
export class UploadFormComponent implements FormComponent {

  errorMessage: string | undefined = undefined;
  processing: boolean = false;
  processMessage: string = 'Saving Project...';
  updated: boolean = false;

  file: File | undefined;

  uploading: boolean = false;
  uploadMessage: string = "";
  uploadFinished: boolean = false;
  currentProgress : string = "";

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};

  constructor(private projectService: ProjectService) {}

  public selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      // @ts-ignore
      this.file = e.target.files[0];
    }
    input.click()
  }

  public async upload() {
    this.uploading = true;
    const dotInterval = progressTextDots("Uploading", this.uploadMessage);

    if(this.file){
      const formData = new FormData();
      formData.append('file', this.file);
      await this.projectService.upload(
        formData,
        (bytes) => {
          this.currentProgress = formatBytes(bytes)
          // @ts-ignore
          if(bytes == this.file.size) this.uploadFinished = true;
        },
        () => {
          clearInterval(dotInterval);
          this.uploadFinished = true;
          this.file = undefined;
        },
      )
    }
  }

  public cancel() {
    this.file = undefined;
  }
}
