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
  links : Links[],
  images : string[]
  imageUrl : string
}

export interface ExtraDetail {
  key : String,
  value : String
}

export interface Links{
  provider : string,
  url : string,
}
