import {Project} from "./Project";

export interface ProjectType {
  id : string;
  type : string;
  projects : Project[];
}
