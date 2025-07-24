import {ProjectLink} from "./projectLink";
import {ProjectSubType} from "../enums/ProjectSubType";

export interface Project {
  projectId : number;

  projectTypeId : number;

  title: string;

  description: string;

  version: string;

  filesize: string;

  fileName : string;

  projectThumbnail: string;

  publisherName : string;

  publishedDate: Date;

  links: ProjectLink[];

  images: string[];

  isFeatured : boolean;

  isFeaturedPersonal :boolean;

  isHidden : boolean;

  isPublished : boolean;

  extraDetails : [{ key : string, value : string }];

  ProjectSubTypeDiscriminator : ProjectSubType;
}
