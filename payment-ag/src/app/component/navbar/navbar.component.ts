import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule
    , RouterModule ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public isMobile: boolean = false; 
  private isBrowser: boolean;
  public activeRoute: string = '';
  public isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url; // Get the current route
        this.isLoggedIn = this.isLoggedInNow();
        
        // Trigger logout when user navigates to login page
        if (this.activeRoute === '/web-payment/loginpage') {
          this.logout(); // Log out the user when they navigate to the login page
        }
      }
    });
  }

  // ✅ Only listen for window resize in the browser
  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  // ✅ Initialize on component load (only in browser)
  public ngOnInit() {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  public checkScreenSize() {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= 768;
    }
  }


  public logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accountRole');
      this.router.navigate(['web-payment/loginpage']);
    }
  }

  public payment(): void {
    this.router.navigate(['web-payment/pymntpage']);
  }

  public history(): void {
    this.router.navigate(['web-payment/history-header']);
  }

  public isHistoryActive(): boolean {
    const currentRoute = this.router.url.split('?')[0];
    return currentRoute === '/web-payment/history-header' || currentRoute === '/web-payment/history-detail';
  }


  public manageuser(): void {
    this.router.navigate(['web-payment/mnusrpage']);
  }

  public login(): void {
    this.router.navigate(['web-payment/loginpage']);
  }

  public get accountRole(): string | null {
    return this.isBrowser ? localStorage.getItem('accountRole') : null;
  } 
   public isLoggedInNow(): boolean {
    return this.isBrowser && !!localStorage.getItem('accountRole');
  }
}
