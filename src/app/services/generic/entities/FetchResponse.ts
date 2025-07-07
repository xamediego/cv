export interface FetchResponse<T> {
  statusCode : number;
  statusText : string;
  responseBody : T;
}
