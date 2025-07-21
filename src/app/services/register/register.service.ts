import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";
import {RegisterRequest} from "../entities/registerRequest";
import {FetchResponse} from "../generic/entities/FetchResponse";
import {ConfirmEmail} from "../entities/confirmEmail";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiLink: string = `${environment.MainApi}/auth/register`;

  constructor(private fetchService: FetchService) {
  }

  public async register(username: string, displayName : string, password: string, email: string): Promise<FetchResponse<string>> {
    const apiLink = `${this.apiLink}/register`;
    const method = "POST";

    const registerDto: RegisterRequest = {
      username,
      displayName,
      password,
      email
    };

    return await this.fetchService.fetchData(apiLink, method, registerDto)
  }

  async confirmRegistration(username: string, emailToken : string) : Promise<FetchResponse<string>>  {
    const apiLink = `${this.apiLink}/confirmRegister`;
    const method = "POST";

    const confirmDto: ConfirmEmail = {
      username,
      emailToken
    };

    return await this.fetchService.fetchData(apiLink, method, confirmDto)
  }
}
