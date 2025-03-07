import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
    , NavbarComponent
    , RecaptchaModule
    , CommonModule
    , RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected `styleUrl` to `styleUrls`
})
export class AppComponent {
  title = 'payment-ag';
  isMobile: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    } else {
      this.isMobile = false; // Default value when not in the browser
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('accountRole');
  }

  public username(): string | null {
    return localStorage.getItem('username');
  }
}
 