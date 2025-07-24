import {Project} from "./project";

export interface ProjectType {
  projectTypeId : number;
  type: string;
  title: string;
  thumbnail: string;
  projectCount : number;
  icon: string;
  projects : Project[];
}
