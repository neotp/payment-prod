import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: any, state: unknown): boolean {
    // Ensure we are on the browser side before accessing localStorage
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Prevent SSR from breaking
    }

    const userRole = localStorage.getItem('accountRole'); // Get user role

    if (!userRole) {
      this.router.navigate(['loginpage']); // Redirect if not logged in
      return false;
    }

    // 🔹 Define role-based allowed routes
    const allowedAdminRoutes = ['mnusrpage', 'pymntpage','history-header', 'history-detail'];
    const allowedUserRoutes = ['pymntpage','history-header', 'history-detail'];

    // Check if the route is allowed based on user role
    const currentRoute = route.routeConfig?.path?.toLowerCase();
    const isRouteAllowed = this.isRouteAllowed(userRole, currentRoute, allowedAdminRoutes, allowedUserRoutes);

    if (!isRouteAllowed) {
      this.router.navigate(['pymntpage']); // Redirect users to payment page
      return false;
    }

    return true;
  }

  private isRouteAllowed(userRole: string, currentRoute: string, allowedAdminRoutes: string[], allowedUserRoutes: string[]): boolean {
    // Admin routes
    if (userRole === 'admin') {
      return allowedAdminRoutes.some(route => currentRoute.startsWith(route.toLowerCase()));
    }
    
    // User routes
    if (userRole === 'user') {
      return allowedUserRoutes.some(route => currentRoute.startsWith(route.toLowerCase()));
    }

    return false;
  }
}
