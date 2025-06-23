import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private jwtTokenSubject!: BehaviorSubject<string | null>;
  public jwtToken$: Observable<string | null>;

  private jwtRef: string = "jwtCookie";
  private jwtPath: string = '/';

  constructor(private cookieService: CookieService) {
    const initialJwt = this.getJwtToken();
    this.jwtTokenSubject = new BehaviorSubject<string | null>(initialJwt);
    this.jwtToken$ = this.jwtTokenSubject.asObservable();
  }

  setJwtToken(newValue: string) {
    this.cookieService.set(this.jwtRef, newValue, undefined, this.jwtPath);
    this.jwtTokenSubject.next(newValue);
  }

  removeJwtToken() {
    this.cookieService.delete(this.jwtRef, this.jwtPath);
    this.jwtTokenSubject.next(null);
  }

  public getJwtToken(): string{
    return this.cookieService.get(this.jwtRef);
  }

  public hasJwt(): boolean {
    return !!this.getJwtToken();
  }

  public getUserClaims() : string[] {
    const decoded : string = jwtDecode(this.getJwtToken());

    // @ts-ignore
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication'];
  }

  public getUsernameFromJwt(): string {
    const decoded = jwtDecode(this.getJwtToken());

    // @ts-ignore
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  }

  public isRegistrationFinished(): boolean {
    const decoded = jwtDecode(this.getJwtToken());

    // @ts-ignore
    const finished  = decoded['RegistrationFinished'];

    return finished === 'True'
  }
}
