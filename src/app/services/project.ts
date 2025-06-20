export interface ProjectType{
  projectType : string
  projects : Project[]
}

export interface Project {
  title : string,
  description : string,
  version : string,
  filesize : string,
  date : Date,
  extraDetails : ExtraDetail[],
  links : string[],
  images : string[]
}

export interface ExtraDetail {
  key : String,
  value : String
}
