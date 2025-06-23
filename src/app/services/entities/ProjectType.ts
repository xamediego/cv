import {Project} from "./Project";

export interface ProjectType {
  type: string;
  title: string;
  thumbnail: string;
  icon: string;
  projects : Project[];
}
