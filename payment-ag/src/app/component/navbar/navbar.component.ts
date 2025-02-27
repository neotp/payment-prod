import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('accountRole');
  }

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accountRole');
      this.router.navigate(['payment/loginpage']);
    }
  }

  public payment(): void {
      this.router.navigate(['payment/pymntpage']);
  }

  public manageuser(): void {
      this.router.navigate(['payment/mnusrpage']);
  }

  public get accountRole(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('accountRole') : null;
  }
}
