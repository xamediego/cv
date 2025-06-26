import {LinkDto} from "./LinkDto";
import {ProjectSubType} from "../enums/ProjectSubType";

export interface ProjectDto {
  title: string;
  description: string;
  version: string;
  filesize: string;
  projectThumbnail: string;
  publishedDate: Date;
  links: LinkDto[];
  images: string[];

  extraDetails : [
    {
      key : string,
      value : string
    }
  ]

  projectSubType : ProjectSubType;
}
