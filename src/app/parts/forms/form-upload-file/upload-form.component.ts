import {Component, Input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';

import {EventSpinnerDirective} from "../../event-spinner.directive";
import {formatBytes} from "../../../tools/RandomStuff";
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {FileUploadSummary} from "../../../services/generic/entities/file.upload.summary";
import {UploadControl, UploadService} from "../../../services/generic/upload.service";

@Component({
  selector: 'app-form-upload-file',
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet, EventSpinnerDirective],
  templateUrl: 'upload-form.component.html',
  styleUrls: [
    '../form.component.scss',
    'upload-form.component.scss'
  ]
})
export class UploadFormComponent<R extends FileUploadSummary> {
  @Input() apiLink: string = "";
  @Input() method: 'POST' | 'PUT' = 'POST';
  @Input() onUploadFinished: (response: FetchResponse<R>) => void = () => {};

  file?: File;
  uploadRequest?: UploadControl;

  uploading = false;
  uploadFinished = false;

  uploadMessage = '';
  currentProgress = '';

  uploadResultTitle: string = '';
  uploadResultMessage: string = '';

  processing = false;
  processMessage = 'Saving Project...';
  updated = false;

  private dotInterval?: ReturnType<typeof setInterval>;
  constructor(private uploadService: UploadService) {}

  // === File Input ===
  selectFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.file = target.files?.[0];
    };
    input.click();
  }

  removeFile(): void {
    this.file = undefined;
  }

  // === Upload Control ===
  async upload(): Promise<void> {
    if (!this.file) return;

    this.uploading = true;
    this.setProgressMessage('Uploading');

    const formData = new FormData();
    formData.append('file', this.file);

    this.uploadRequest = this.uploadService.uploadFile(
      this.apiLink,
      this.method,
      formData,
      this.handleProgress,
      this.handleError,
      this.handleFinish
    );
  }

  cancelUpload(): void {
    this.uploadRequest?.cancel();
    this.clearProgressMessage();

    this.uploadFinished = false;
    this.uploading = false;
    this.processing = false;
  }

  // === Progress & Status Callbacks ===
  private handleProgress = (bytesUploaded: number): void => {
    this.currentProgress = formatBytes(bytesUploaded);

    if (this.file && bytesUploaded >= this.file.size) {
      this.uploadFinished = true;
      this.setProgressMessage('Finalizing Upload');
      return;
    }
  };

  private handleFinish = (response: FetchResponse<R>): void => {
    this.uploadRequest?.cancel();
    this.uploadFinished = true;
    this.uploading = false;
    this.clearProgressMessage();
    this.onUploadFinished(response);
    this.file = undefined;

    this.uploadResultTitle = 'Upload Finished';
    this.uploadResultMessage = 'File has been successfully uploaded';
  };

  private handleError = (response: FetchResponse<string>): void => {
    this.uploading = false;
    this.uploadFinished = true;
    this.clearProgressMessage();

    this.uploadResultTitle = 'Upload Failed';
    this.uploadResultMessage = response.responseBody || 'An unknown error occurred during upload.';
  };

  // === Progress Message Utility ===
  private setProgressMessage(baseText: string): void {
    this.clearProgressMessage();
    let dotCount = 0;
    this.uploadMessage = baseText;

    this.dotInterval = setInterval(() => {
      dotCount = (dotCount % 3) + 1;
      this.uploadMessage = baseText + '.'.repeat(dotCount);
    }, 500);
  }

  private clearProgressMessage(): void {
    if (this.dotInterval) clearInterval(this.dotInterval);
    this.dotInterval = undefined;
  }

  // === Utility Binding ===
  protected readonly formatBytes = formatBytes;
}
