import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/FetchService";

import { FetchResponse } from '../generic/entities/FetchResponse';
import {ProjectType} from "../entities/ProjectType";

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  private apiLink: string = `${environment.MainApi}/ProjectType`;

  constructor(private fetchService : FetchService) {}

  public async findAll(): Promise<FetchResponse<ProjectType[]>> {
    const apiLink = `${this.apiLink}/all`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType[]>(apiLink, method);
  }

  public async findByType(type: string): Promise<FetchResponse<ProjectType>> {
    const apiLink = `${this.apiLink}/type/${type}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType>(apiLink, method);
  }
}
