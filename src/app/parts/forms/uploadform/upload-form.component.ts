import {Component, Input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';

import {FormComponent} from "../form.component";
import {ProjectService} from "../../../services/project/project.service";
import {EventSpinnerDirective} from "../../event-spinner.directive";


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
    this.progressTextDots("Uploading");
    if(this.file){
      const formData = new FormData();
      formData.append('file', this.file);

      await this.projectService.upload(
        formData,
        (bytes) => {this.formatBytes(bytes)},
        () => {
          this.uploadFinished = true;
          this.file = undefined;
        },
      )
    }
  }

  public formatBytes(bytes: number): string {
    if (bytes === 0) return '0.00 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formatted = (bytes / Math.pow(k, i)).toFixed(2);

    return `${formatted} ${sizes[i]}`;
  }

  private progressTextDots(text: string): any {
    let dotCount = 0;
    this.uploadMessage = text;

    return setInterval(() => {
      dotCount = (dotCount % 3) + 1;
      this.uploadMessage = text + ".".repeat(dotCount);
    }, 500);
  }

  public cancel() {
    this.file = undefined;
  }

  currentProgress() {
    return this.formatBytes(0);
  }
}
