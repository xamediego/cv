import { Injectable } from '@angular/core';
import { FetchResponse } from './entities/FetchResponse';
import { UserService } from "./UserService";

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

    const headers: any = {
      Authorization: jwt ? `Bearer ${jwt}` : `Bearer ${this.userService.getJwtToken()}`,
    };

    if (!(body instanceof FormData)) headers['Content-Type'] = content;

    const fetchData: any = {
      headers,
      method,
      body: body instanceof FormData ? body : JSON.stringify(body),
    };

    return await fetch(apiLink, fetchData).then(async (res) => {
      const contentType = res.headers.get('content-type');

      const returnVal : FetchResponse<T> = {
        statusCode: res.status,
        responseBody:
          contentType && contentType.includes(content)
            ? await res.json()
            : await res.text(),
      };

      return returnVal;
    });
  }

  async fetchBlob(apiLink: string, method: string, jwt?: string): Promise<Blob> {
    const headers: any = {
      Authorization: jwt ? `Bearer ${jwt}` : `Bearer ${this.userService.getJwtToken()}`,
    };

    const fetchData: any = {
      headers,
      method,
    };

    return await fetch(apiLink, fetchData).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Error fetching blob: ${res.status} - ${res.statusText}`);
      }
      return await res.blob();
    });
  }
}
