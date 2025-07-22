import {Injectable} from '@angular/core';
import {FetchService} from "../generic/fetch.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private fetchService: FetchService) {
  }

  public async download(
    apiLink: string,
    method: string,
    fileName: string,
    onResponse: ((response: Response) => void),
    onProgress: ((received: number, total: number) => void),
    jwt?: string,
    body?: any): Promise<Response> {

    return await this.fetchService.fetchBlob(apiLink, method, fileName, body, jwt, undefined, onResponse, onProgress);
  }

  public async upload(apiLink: string,
                      method: string,
                      formData: FormData,
                      onProgress : ((bytes : number) => void),
                      onFinished : () => void
  ) {
    await this.fetchService.upload(apiLink, method, formData, onProgress, onFinished);
  }
}
