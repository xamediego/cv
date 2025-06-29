import {Injectable} from '@angular/core';
import {FetchResponse} from './entities/FetchResponse';
import {UserService} from "./UserService";

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

    const fetchData = this.createHeader(method, body, jwt);

    return await fetch(apiLink, fetchData).then(async (res) => {
      const contentType = res.headers.get('content-type');

      const returnVal: FetchResponse<T> = {
        statusCode: res.status,

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
                  filename : string,
                  body?: any,
                  jwt?: string,
                  onResponse? : ((response : Response) => void),
                  onProgress?: ((received: number, total: number) => void)): Promise<Response> {
    // this.createHeader(method, body, jwt);

    const response = await fetch(apiLink);

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

    // Trigger download
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(downloadUrl);

    return response;
  }

  private createHeader(method: string,
                       body?: any,
                       jwt?: string,
                       content: string = 'application/json'): any {
    const headers: any = {
      Authorization: jwt ? `Bearer ${jwt}` : `Bearer ${this.userService.getJwtToken()}`,
    };

    if (!(body instanceof FormData)) headers['Content-Type'] = content;

    return {
      headers,
      method,
      body: body instanceof FormData ? body : JSON.stringify(body),
    };
  }
}
