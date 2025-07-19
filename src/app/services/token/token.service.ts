import {Injectable} from "@angular/core";
import {FetchService} from "../generic/fetch.service";
import {FetchResponse} from "../generic/entities/FetchResponse";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TokenService{

  private apiLink: string = `${environment.MainApi}/auth/token`;

  constructor(private fetchService : FetchService) {}

  async getTotpSecretKey() : Promise<FetchResponse<any>>{
    const apiLink = `${this.apiLink}/getSecret`;
    const method = 'GET';

    return await this.fetchService.fetchData<any>(apiLink, method)
  }

}
