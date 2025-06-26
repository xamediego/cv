import {ProjectDto} from "./ProjectDto";

export interface ProjectTypeDto {
  type: string;
  title: string;
  thumbnail: string;
  icon: string;
  projects : ProjectDto[];
}
