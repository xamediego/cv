import {ProjectDto} from "./project.dto";

export interface ProjectTypeDto {
  type: string;
  title: string;
  thumbnail: string;
  icon: string;
  projects : ProjectDto[];
}
