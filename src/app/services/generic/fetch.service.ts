import {Injectable} from '@angular/core';
import {FetchResponse} from './entities/FetchResponse';
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  constructor(private userService: UserService) {}

  async fetchData<T>(
    apiLink: string,
    method: string,
    body?: any,
    jwt?: string,
    content: string = 'application/json'
  ): Promise<FetchResponse<T>> {
    const fetchData = this.createHeader(method, body, jwt, content);
    return await fetch(apiLink, fetchData).then(async (res) => {
      const contentType = res.headers.get('content-type');
      const returnVal: FetchResponse<T> = {
        statusCode: res.status,
        statusText: res.statusText,
        responseBody:
          contentType && contentType.includes(content)
            ? await res.json()
            : await res.text(),
      };
      return returnVal;
    });
  }

  async fetchBlob(apiLink: string,
                  method: string,
                  filename: string,
                  body?: any,
                  jwt?: string,
                  content: string = 'application/json',
                  onResponse?: ((response: Response) => void),
                  onProgress?: ((received: number, total: number) => void)): Promise<Response> {
    const fetchData = this.createHeader(method, body, jwt, content);
    const response = await fetch(apiLink, fetchData);

    if (onResponse) onResponse(response);
    if (!response.ok) return response;

    const cHeader = "Content-Length";
    if (response.headers.get(cHeader) == null) throw new Error("No Corresponding Header");

    // @ts-ignore
    const contentLength = +response.headers.get(cHeader);

    if (response.body == null) throw new Error("No body detected")

    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const {done, value} = await reader.read();

      if (done) break;

      chunks.push(value);
      received += value.length;

      if (onProgress) onProgress(received, contentLength);
    }

    const blob = new Blob(chunks);
    const downloadUrl = URL.createObjectURL(blob);

    this.triggerDownload(downloadUrl, filename)
    return response;
  }

  private triggerDownload(downloadUrl: string, filename: string) {
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  }

  private createHeader(method: string,
                       body?: any,
                       jwt?: string,
                       content: string = 'application/json'): any {
    const headers: any = {Authorization: jwt ? `Bearer ${jwt}` : `Bearer ${this.userService.getJwtToken()}`,};

    if (!(body instanceof FormData)) headers['Content-Type'] = content;

    return {
      headers,
      method,
      body: body instanceof FormData ? body : JSON.stringify(body),
    };
  }

  async upload(apiLink: string, method: string, formData: FormData, jwt?: string) {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        console.log('Upload complete:', xhr.responseText);
      } else {
        console.error('Upload failed:', xhr.statusText);
      }
    };

    xhr.onerror = () => {
      console.error('An error occurred during the upload.');
    };

    xhr.open(method, apiLink);
    xhr.setRequestHeader("Authorization", "Bearer " + (jwt ? jwt : this.userService.getJwtToken()))

    xhr.send(formData);
  }
}
