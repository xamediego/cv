export interface OperationResult<T>{
  isSuccessful : boolean,
  code : number,
  description : string,
  resultValue : T,
}
