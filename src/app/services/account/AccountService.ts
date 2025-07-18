import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";
import {FetchResponse} from "../generic/entities/FetchResponse";
import {UserDataDto} from "../entities/UserDataDto";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiLink: string = `${environment.MainApi}/auth/account`;

  constructor(private fetchService: FetchService) {}

  public async getAccountData(): Promise<FetchResponse<UserDataDto>> {
    const apiLink = `${this.apiLink}/getAccountData`;
    const method = "GET";

    return await this.fetchService.fetchData<UserDataDto>(apiLink, method);
  }
}
