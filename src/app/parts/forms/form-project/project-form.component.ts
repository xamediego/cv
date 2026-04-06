import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FetchResponse} from "../../../services/generic/entities/FetchResponse";
import {ProjectService} from "../../../services/project/project.service";
import {Project} from "../../../services/entities/project";
import {ProjectType} from "../../../services/entities/project.type";
import {EventSpinnerDirective} from "../../event-spinner.directive";
import {NgTemplateOutlet} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ImageCutterComponent} from "../../image-cutter/image-cutter.component";
import {MatSnackBar} from '@angular/material/snack-bar';
import {UploadControl} from "../../../services/generic/upload.service";
import {formatBytes} from "../../../tools/RandomStuff";
import {ProjectTypeService} from "../../../services/projecttype/project-type.service";
import {ButtonComponent} from "../../button/button.component";
import {UploadFormComponent} from "../form-upload-file/upload-form.component";

@Component({
  selector: 'app-form-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EventSpinnerDirective,
    NgTemplateOutlet,
    ButtonComponent,
    UploadFormComponent,
  ],
  templateUrl: './project-form.component.html',
  styleUrls: [
    '../form.component.scss',
    'project-form.component.scss'
  ]
})
export class ProjectFormComponent implements OnInit {
  form: FormGroup;

  errorMessage: string | undefined = undefined;
  processing: boolean = false;
  updated: boolean = false;
  projectImages: string[] = []

  @Input() public onFormClosed: () => void = () => {};
  @Input() public onFormSuccess: () => void = () => {};
  @Input() public processMessage: string = '';

  @Input() public project: Project | undefined;
  @Input() public projectTypes: ProjectType[] = [];
  @Input() public onProjectDelete: () => void = () => {};

  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private projectTypeService: ProjectTypeService,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', Validators.maxLength(1000)],
      isFeatured: [false],
      isHidden: [false],
      projectTypeId: [null, Validators.required],
    });
  }

  public async ngOnInit() {
    if (this.project) {
      this.projectImages = this.project.images;

      this.form.patchValue({
        title: this.project.title,
        description: this.project.description,
        isFeatured: this.project.isFeatured,
        isHidden: this.project.isHidden,
        projectTypeId: this.project.projectTypeId,
      });
    }

    if (this.projectTypes.length < 1) await this.retrieveProjectTypes();
  }

  private async retrieveProjectTypes() {
    this.processing = true;
    this.processMessage = 'Retrieving types';

    const response = await this.projectTypeService.findAll();
    if (response.statusCode == 200) this.projectTypes = response.responseBody;

    this.processing = false;
    this.processMessage = '';
  }

  public async delete() {
    this.processing = true;
    this.processMessage = 'Deleting project...';
    if (this.project == undefined) return;
    this.processing = false;

    return this.projectService.deleteProject(this.project.projectId);
  }

  public async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please correct the highlighted fields.';
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = undefined;

    await this.processForm();
  }

  private async processForm() {
    this.processing = true;
    this.processMessage = 'Saving project...';
    await this.updateProjectRequest();
    this.processing = false;
  }

  private onSuccess: (project: Project) => Promise<void> = async (project) => {
    this.project = project;
    this._snackBar.open('Project Updated', undefined, {duration: 3000});
    this.onFormSuccess();
  }

  private async updateProjectRequest(): Promise<UploadControl> {
    const projectData = {
      ...this.project,
      ...this.form.value
    };

    projectData.projectImages = this.projectImages;
    let images: { blob: Blob, index: number }[] = [];

    for (let i = 0; i < projectData.projectImages.length; i++) {
      const url: string = projectData.projectImages[i];
      const response = await fetch(url);
      const blob: Blob = await response.blob();
      images.push({blob: blob, index: (i + 1)});
    }

    const data = new FormData();
    images.forEach((image, i) => {
      data.append('blob', image.blob, `${image.index}.jpg`);
    });

    const totalSize: string = formatBytes(0);
    let currentProgress: string = formatBytes(0);
    return this.projectService.updateImages(
      projectData.projectId,
      data,
      (bytes: number) => {
        currentProgress = formatBytes(bytes);
      },
      (response: FetchResponse<string>) => {
        this._snackBar.open('Error while uploading images', undefined, {duration: 3000});
      },
      async (response: FetchResponse<string>) => {
        if (response.statusCode == 200) {
          const result = await this.projectService.updateProject(projectData);
          await this.onSuccess(result.responseBody)
        } else {
          this._snackBar.open('Error while uploading images', undefined, {duration: 3000});
        }
      },
    )
  }

  private selectedImageIndex: number = 0;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public triggerImageSelect(index: number): void {
    this.selectedImageIndex = index;
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result as string;
      const dialogRef = this.dialog.open(ImageCutterComponent, {
        width: '400px',
        data: imageUrl
      });

      dialogRef.afterClosed().subscribe((base64: string | null) => {
        if (base64) {
          const blob = this.base64ToBlob(base64, 'image/png');
          const imageUrl = URL.createObjectURL(blob);

          if (this.selectedImageIndex == -1) {
            this.projectImages.push(imageUrl);
          } else {
            this.projectImages[this.selectedImageIndex] = imageUrl;
          }
        }
        console.log(this.projectImages)
      });
    };
    reader.readAsDataURL(file);
  }

  private base64ToBlob(base64 : string, mime = 'image/png') {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mime});
  }

  public uploadFile() {

  }
}
