import {Injectable} from '@angular/core';
import {ProjectDto} from "../entities/ProjectDto";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/FetchService";
import {FetchResponse} from "../generic/entities/FetchResponse";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiLink: string = `${environment.MainApi}/Project`;

  constructor(private fetchService: FetchService) {}

  public async findAll(): Promise<FetchResponse<ProjectDto[]>> {
    const apiLink = `${this.apiLink}/all`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectDto[]>(apiLink, method);
  }

  public async findByTitle(title: String): Promise<FetchResponse<ProjectDto>> {
    const apiLink = `${this.apiLink}/title/${title}`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectDto>(apiLink, method);
  }

  public async findFeatured(): Promise<FetchResponse<ProjectDto[]>>{
    const apiLink = `${this.apiLink}/featured`;
    const method = 'GET';

    return await this.fetchService.fetchData<ProjectDto[]>(apiLink, method);
  }

  public async download(fileName: string,
                        title: string,
                        id: number,
                        onResponse : ((response : Response) => void),
                        onProgress: ((received: number, total: number) => void)): Promise<Response> {
    const apiLink = `${this.apiLink}/download/${title}/${id}`;
    const method = 'GET';

    return await this.fetchService.fetchBlob(apiLink, method, fileName, undefined, undefined, onResponse, onProgress);
  }
}
