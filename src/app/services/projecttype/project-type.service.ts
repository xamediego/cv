import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";

import { FetchResponse } from '../generic/entities/FetchResponse';
import {ProjectTypeDto} from "../entities/project-type.dto";

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  private apiLink: string = `${environment.MainApi}/ProjectType`;

  constructor(private fetchService : FetchService) {}

  public async findAll(): Promise<FetchResponse<ProjectTypeDto[]>> {
    const apiLink = `${this.apiLink}/all`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectTypeDto[]>(apiLink, method);
  }

  async findAllComplete() {
    const apiLink = `${this.apiLink}/all/complete`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectTypeDto[]>(apiLink, method);
  }

  public async findByType(type: string): Promise<FetchResponse<ProjectTypeDto>> {
    const apiLink = `${this.apiLink}/type/${type}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectTypeDto>(apiLink, method);
  }

  async findByTypeComplete(type: string) {
    const apiLink = `${this.apiLink}/type/complete/${type}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectTypeDto>(apiLink, method);
  }
}
