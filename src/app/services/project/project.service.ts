import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";
import {FetchResponse} from "../generic/entities/FetchResponse";
import featured from "../../../assets/featured.json";
import {Project} from '../entities/project';
import {UploadControl, UploadService} from "../generic/upload.service";
import {Form} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiLink: string = `${environment.MainApi}/Project`;

  constructor(private fetchService: FetchService, private uploadService : UploadService) {}

  public async findAll(): Promise<FetchResponse<Project[]>> {
    const apiLink = `${this.apiLink}/all`;
    const method = 'GET';

    return await this.fetchService.fetchData<Project[]>(apiLink, method);
  }

  public async findByTitle(title: String): Promise<FetchResponse<Project>> {
    const apiLink = `${this.apiLink}/title/${title}`;
    const method = 'GET';

    return await this.fetchService.fetchData<Project>(apiLink, method);
  }

  public  async updateProject(projectData: Project) : Promise<FetchResponse<Project>>{
    const apiLink = `${this.apiLink}/update`;
    const method = 'POST';

    return await this.fetchService.fetchData<Project>(apiLink, method, projectData);
  }

  public async deleteProject(projectId: number) {
    const apiLink = `${this.apiLink}/delete`;
    const method = 'DELETE';

    return await this.fetchService.fetchData<Project>(apiLink, method, projectId);
  }

  public findFeaturedLocal(): {title : string, url : string}[]{
    return featured.projects;
  }

  public updateImages<R>(
    projectId: number,
    data: FormData,
    onProgress: (bytesUploaded: number) => void,
    onError: (response: FetchResponse<string>) => void,
    onFinished: (response: FetchResponse<R>) => void,
  ) : UploadControl{
    const apiLink = `${this.apiLink}/images/update/${projectId}`;
    const method = 'POST';

    return this.uploadService.uploadFile<R>(apiLink, method, data, onProgress, onError, onFinished);
  }
}
