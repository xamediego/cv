import {ProjectLink} from "./projectLink";
import {ProjectSubType} from "../enums/ProjectSubType";

export interface Project {
  id : number;
  title: string;
  description: string;
  version: string;
  filesize: string;
  projectThumbnail: string;
  publishedDate: Date;
  links: ProjectLink[];
  images: string[];
  fileName : string;
  publisherName : string;

  extraDetails : [{ key : string, value : string }];
  projectSubType : ProjectSubType;
}
