import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {FetchService} from "../generic/fetch.service";
import {LoginDto} from "../entities/login.dto"

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiLink: string = `${environment.MainApi}/login`;

  constructor(private fetchService : FetchService) {}

  public async login(username : string, password : string){
    const apiLink = `${this.apiLink}/login`;
    const method = "POST";

    const loginDto: LoginDto = {
      username,
      password,
    };

    return await this.fetchService.fetchData(apiLink, method, loginDto)
  }
}
