import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import {FetchResponse} from "./entities/FetchResponse";

export interface UploadControl {
  cancel: () => void;
  xhr: XMLHttpRequest;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  constructor(private userService: UserService) {}

  public uploadFile<R>(
    apiLink: string,
    method: 'POST' | 'PUT',
    data: FormData,
    onProgress: (bytesUploaded: number) => void,
    onError: (response: FetchResponse<string>) => void,
    onFinished: (response: FetchResponse<R>) => void,
    jwt?: string
  ): UploadControl {const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        onProgress(event.loaded);
      }
    };

    xhr.onload = () => {
      const responseBody = this.tryParseJson(xhr.response);
      const response = {
        statusCode: xhr.status,
        statusText: xhr.statusText,
        responseBody,
      };

      if (xhr.status >= 200 && xhr.status < 300) {
        onFinished(response as FetchResponse<R>);
      } else {
        onError(response as FetchResponse<string>);
      }
    };

    xhr.onerror = () => {
      const response: FetchResponse<string> = {
        statusCode: xhr.status,
        statusText: xhr.statusText,
        responseBody: xhr.response,
      };
      onError(response);
    };

    xhr.open(method, apiLink);
    xhr.setRequestHeader('Authorization', 'Bearer ' + (jwt ?? this.userService.getJwtToken()));
    xhr.send(data);

    return {
      cancel: () => {
        xhr.abort();
      },
      xhr,
    };
  }

  private tryParseJson(response: any): any {
    try {
      return JSON.parse(response);
    } catch {
      return response;
    }
  }
}

