import {LinkDto} from "./link.dto";
import {ProjectSubType} from "../enums/ProjectSubType";

export interface ProjectDto {
  id : number;
  title: string;
  description: string;
  version: string;
  filesize: string;
  projectThumbnail: string;
  publishedDate: Date;
  links: LinkDto[];
  images: string[];
  fileName : string;

  extraDetails : [
    {
      key : string,
      value : string
    }
  ]

  projectSubType : ProjectSubType;
}
