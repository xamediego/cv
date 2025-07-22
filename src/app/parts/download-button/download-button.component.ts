import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {EventSpinnerDirective} from "../event-spinner.directive";
import {FileService} from "../../services/download/file.service";
import {formatBytes} from "../../tools/RandomStuff";

@Component({
  selector: 'app-download-button',
  imports: [
    NgClass,
    EventSpinnerDirective
  ],
  templateUrl: './download-button.component.html',
  styleUrl: './download-button.component.scss'
})
export class DownloadButtonComponent {
  @Input() apiLink: string = "";
  @Input() method: string = "";
  @Input() filename: string = "";

  formattedProgress: string = "1mb / 2mb";
  downloadPercentage: string = "0%";
  downloadButtonText: string = "⬇ Download"

  downloading: boolean = false;
  downloadFinished: boolean = false;

  constructor(private downloadService: FileService) {}

  public async downloadFile() {
    if (this.downloading || this.downloadFinished) return;

    this.downloadButtonText = "Download Starting...";
    let dotInterval: any;

    const response = await this.downloadService.download(
      this.apiLink,
      this.method,
      this.filename,

      (response: Response) => {
        if (response.status == 200) {
          this.downloading = true;
          dotInterval = this.progressTextDots("Downloading");
        } else {
          this.downloadButtonText = response.statusText;
        }
      },

      (received: number, total: number) => {
        const percent = total ? Math.round((received / total) * 100) : 0;

        const receivedFormatted = formatBytes(received);
        const totalFormatted = formatBytes(total);

        this.formattedProgress = `${receivedFormatted} / ${totalFormatted}`;
        this.downloadPercentage = `${percent}%`;
      })

    this.downloading = false;
    clearInterval(dotInterval);

    if (response.status == 200) {
      this.downloadFinished = true;
      this.downloadButtonText = "Download Finished"
    } else {
      this.downloadButtonText = response.statusText
    }
  }

  private progressTextDots(baseText: string): any {
    let dotCount = 0;
    this.downloadButtonText = baseText;

    return setInterval(() => {
      dotCount = (dotCount % 3) + 1;
      this.downloadButtonText = baseText + ".".repeat(dotCount);
    }, 500);
  }

}
