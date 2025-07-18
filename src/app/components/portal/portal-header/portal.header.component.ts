import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {UserService} from "../../../services/generic/user.service";
import {AuthenticationService} from "../../../services/authentication/authentication.service";

@Component({
  selector: 'portal-app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './portal.header.component.html',
  styleUrl: './portal.header.component.scss'
})
export class PortalHeaderComponent {
  public showDropdown = false;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(
    public userService: UserService,
    private authenticationService: AuthenticationService
  ) {}

  public async logout() {
    await this.authenticationService.logout();
    this.showDropdown = false;
  }

  public toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  public closeDropdown(): void {
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }
}
