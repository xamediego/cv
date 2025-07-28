import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";

import { FetchResponse } from '../generic/entities/FetchResponse';
import {ProjectType} from "../entities/project.type";

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

  async findAllComplete() {
    const apiLink = `${this.apiLink}/all/complete`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType[]>(apiLink, method);
  }

  public async findByType(type: string): Promise<FetchResponse<ProjectType>> {
    const apiLink = `${this.apiLink}/type/${type}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType>(apiLink, method);
  }

  async findByTypeComplete(type: string) {
    const apiLink = `${this.apiLink}/type/complete/${type}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType>(apiLink, method);
  }

  async findCatalog() {
    const apiLink = `${this.apiLink}/catalog`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType[]>(apiLink, method);
  }

  async findByUsername(username: any) : Promise<FetchResponse<ProjectType[]>>{
    const apiLink = `${this.apiLink}/user/${username}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType[]>(apiLink, method);
  }

  async findByUsernameAll(username: any) : Promise<FetchResponse<ProjectType[]>>{
    const apiLink = `${this.apiLink}/user/all/${username}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType[]>(apiLink, method);
  }

  async findPersonal() : Promise<FetchResponse<ProjectType[]>>{
    const apiLink = `${this.apiLink}/user/personal`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectType[]>(apiLink, method);
  }
}
