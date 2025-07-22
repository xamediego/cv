import {Injectable} from "@angular/core";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from "../generic/user.service";

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private userService: UserService) {}

  public isValid(token : string): boolean {
    const helper = new JwtHelperService();

    return !helper.isTokenExpired(token);
  }

  public isAuthorized() : boolean {
    const token = this.userService.getJwtToken();

    if (token === '') return false;

    return this.isValid(token);
  }

  public isAdmin(): boolean {
    const token = this.userService.getJwtToken();

    if (token === '') return false;

    const helper = new JwtHelperService();

    if(helper.isTokenExpired(token)) return false;

    const claims = this.userService.getUserClaims();

    return claims.includes('admin');
  }
}
