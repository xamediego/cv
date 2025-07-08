import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";
import {LoginDto} from "../entities/login.dto"
import {FetchResponse} from "../generic/entities/FetchResponse";
import {UserService} from "../generic/user.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiLink: string = `${environment.MainApi}/auth/login`;

  constructor(private fetchService : FetchService, private userService : UserService) {}

  public async login(username : string, password : string, code : string) : Promise<FetchResponse<string>>{
    const apiLink = `${this.apiLink}/login`;
    const method = "POST";

    const loginDto: LoginDto = {
      username,
      password,
      code
    };

    const result : FetchResponse<string> = await this.fetchService.fetchData(apiLink, method, loginDto)

    if(result.statusCode == 200) this.userService.setJwtToken(result.responseBody);

    return result;
  }
}
