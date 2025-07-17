import {ProjectDto} from "./project.dto";

export interface ProjectTypeDto {
  type: string;
  title: string;
  thumbnail: string;
  projectCount : number;
  icon: string;
  projects : ProjectDto[];
}
