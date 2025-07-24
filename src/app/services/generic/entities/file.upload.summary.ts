import {Project} from "../../entities/project";

export interface FileUploadSummary {
  totalFilesUploaded : number;
  totalSizeUploaded : number;
  fileNames : string[];
  notUploaded : string[];
}

export interface ProjectUploadSummary extends FileUploadSummary{
  projects : Project[];
}
