import {Injectable} from '@angular/core';
import {FetchService} from "../generic/fetch.service";

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private fetchService: FetchService) {}

  public async download(
    apiLink : string,
    method : string,
    fileName: string,
    onResponse: ((response: Response) => void),
    onProgress: ((received: number, total: number) => void),
    body? : any): Promise<Response> {

    return await this.fetchService.fetchBlob(apiLink, method, fileName, body, undefined, onResponse, onProgress);
  }
}
