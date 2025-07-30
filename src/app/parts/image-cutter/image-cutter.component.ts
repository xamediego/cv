import {Component, ElementRef, ViewChild, Inject, AfterViewInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import Croppie from 'croppie';

@Component({
  selector: 'app-image-cutter',
  imports: [],
  templateUrl: './image-cutter.component.html',
  styleUrls: [
    '../forms/form.component.scss',
    './image-cutter.component.scss'
  ]
})
export class ImageCutterComponent implements AfterViewInit {

  croppie!: Croppie;

  constructor(
    private dialogRef: MatDialogRef<ImageCutterComponent>,
    @Inject(MAT_DIALOG_DATA) public imageUrl: string) {
  }

  @ViewChild('container', {static: true}) container!: ElementRef;
  async ngAfterViewInit() {
    this.croppie = new Croppie(this.container.nativeElement, {
      viewport: { width: 185, height: 115 },
      boundary: { width: 300, height: 200 },

      showZoomer: true,
      enableOrientation: true
    });

    await this.croppie.bind({
      url: this.imageUrl,
      orientation: 1
    });
  }

  confirmCrop(): void {
    this.croppie.result({ type: 'canvas', format: "png" }).then((canvas: any) => {
      this.dialogRef.close(canvas);
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
