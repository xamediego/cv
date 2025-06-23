import {Link} from "./Link";

export interface Project {
  title: string;
  description: string;
  version: string;
  filesize: string;
  projectThumbnail: string;
  publishedDate: Date;
  links: Link[];
  images: string[];
}
