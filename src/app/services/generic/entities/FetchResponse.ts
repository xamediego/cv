export interface FetchResponse<T> {
  statusCode : number;

  responseBody : T;
}
