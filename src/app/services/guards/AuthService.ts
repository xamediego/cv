import {Injectable} from "@angular/core";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from "../generic/user.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService) {}

  public isAuthenticated(): boolean {
    const token = this.userService.getJwtToken();

    if (token === '') return false;

    const helper = new JwtHelperService();

    return !helper.isTokenExpired(token);
  }
}
