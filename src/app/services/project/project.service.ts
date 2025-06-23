import {Injectable} from '@angular/core';
import {Project} from "../entities/Project";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/FetchService";
import {FetchResponse} from "../generic/entities/FetchResponse";

@Injectable({
  providedIn: 'root'
})
export class ProjectService<T extends Project> {

  private apiLink: string = `${environment.MainApi}/Project`;

  constructor(private fetchService : FetchService) {}

  public async findAll(): Promise<FetchResponse<T[]>> {
    const apiLink = `${this.apiLink}/all`;
    const method = 'GET';

    return await this.fetchService.fetchData<T[]>(apiLink, method);
  }

  public async findByTitle(title: String): Promise<FetchResponse<T>> {
    const apiLink = `${this.apiLink}/title/${title}`;
    const method = 'GET';

    return await this.fetchService.fetchData<T>(apiLink, method);
  }
}
