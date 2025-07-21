import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";
import {FetchResponse} from "../generic/entities/FetchResponse";
import {UserData} from "../entities/userData";
import {UserService} from "../generic/user.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiLink: string = `${environment.MainApi}/auth/account`;

  constructor(private fetchService: FetchService, private userService : UserService) {}

  public async getAccountData(): Promise<FetchResponse<UserData>> {
    const apiLink = `${this.apiLink}/getAccountData`;
    const method = "GET";

    return await this.fetchService.fetchData<UserData>(apiLink, method);
  }

  public async deleteAccount(password: string, code: string | undefined) : Promise<FetchResponse<string>>  {
    const apiLink = `${this.apiLink}/deleteAccount`;
    const method = "DELETE";

    const dto = {password, code}

    return await this.fetchService.fetchData<string>(apiLink, method, dto);
  }

  public async updateDisplayName(password: string, displayName: string, code: string | undefined) : Promise<FetchResponse<string>> {
    const apiLink = `${this.apiLink}/updateDisplayName`;
    const method = "PUT";

    const dto = {password, displayName, code}

    return await this.fetchService.fetchData<string>(apiLink, method, dto);
  }

  public async updateEmail(password: string, email: string, code: string | undefined) : Promise<FetchResponse<string>> {
    const apiLink = `${this.apiLink}/updateEmail`;
    const method = "PUT";

    const dto = {password, email, code}

    const result = await this.fetchService.fetchData<string>(apiLink, method, dto);

    if(result.statusCode == 200) this.userService.setJwtToken(result.responseBody);

    return result;
  }

  public async updateUsername(password: string, username: string, code: string | undefined) : Promise<FetchResponse<string>> {
    const apiLink = `${this.apiLink}/updateUsername`;
    const method = "PUT";

    const dto = {password, username, code}

    const result = await this.fetchService.fetchData<string>(apiLink, method, dto);

    if(result.statusCode == 200) this.userService.setJwtToken(result.responseBody);

    return result;
  }

  public async updatePassword(password: string, newPassword: string, code: string | undefined) : Promise<FetchResponse<string>> {
    const apiLink = `${this.apiLink}/updatePassword`;
    const method = "PUT";

    const dto = {password, newPassword, code}

    return await this.fetchService.fetchData<string>(apiLink, method, dto);
  }

  public async mfaEnabled(): Promise<FetchResponse<boolean>> {
    const apiLink = `${this.apiLink}/mfaEnabled`;
    const method: string = 'GET';

    return await this.fetchService.fetchData<boolean>(apiLink, method);
  }

  public async enableMFA(password : string, code : string) : Promise<FetchResponse<string>> {
    return await this.updateMfa(password, code, true)
  }

  public async disableMFA(password: string, code: string) : Promise<FetchResponse<string>> {
    return await this.updateMfa(password, code, false)
  }

  private async updateMfa(password : string, code : string, isEnabled : boolean) : Promise<FetchResponse<string>>{
    const apiLink = `${this.apiLink}/updateMfa`;
    const method = "PUT";

    const dto = {password, code, isEnabled}

    return await this.fetchService.fetchData<string>(apiLink, method, dto);
  }
}
