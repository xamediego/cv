export interface ProjectType{
  type : string
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
  imageUrl : string
}

export interface ExtraDetail {
  key : String,
  value : String
}
