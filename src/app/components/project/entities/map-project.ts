export interface MapProject {
  title : string,
  description : string,
  filesize : string,
  date : Date,
  extraDetails : extraDetail[],
  links : string[],
  images : string[]
}


export interface extraDetail {
  key : String,
  value : String
}
