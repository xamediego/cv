import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";
import {LoginRequest} from "../entities/loginRequest"
import {FetchResponse} from "../generic/entities/FetchResponse";
import {UserService} from "../generic/user.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiLink: string = `${environment.MainApi}/auth/authentication`;

  constructor(private fetchService : FetchService, private userService : UserService, private router : Router) {}

  public async login(username : string, password : string, code : string) : Promise<FetchResponse<string>>{
    const apiLink = `${this.apiLink}/login`;
    const method = "POST";

    const loginDto: LoginRequest = {
      username,
      password,
      code
    };

    const result : FetchResponse<string> = await this.fetchService.fetchData(apiLink, method, loginDto)
    if(result.statusCode == 200) this.userService.setJwtToken(result.responseBody);
    return result;
  }

  public async logout() : Promise<void>{
    const apiLink = `${this.apiLink}/logout`;
    const method = "POST";

    const result : FetchResponse<string> = await this.fetchService.fetchData(apiLink, method)

    if(result.statusCode == 200){
      this.userService.removeJwtToken();

      location.href = "/home";
    }
  }
}
