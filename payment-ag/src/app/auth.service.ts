import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private inactivityTimeout: number = 30 * 60 * 1000; // 30 seconds in milliseconds
  private timeoutTimer: any;
  private logTimer: any;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}


  // Set the last activity time
  public setLastActivityTime(): void {
    localStorage.setItem('lastActivityTime', Date.now().toString());
  }

  // Get the last activity time
  public getLastActivityTime(): number | null {
    return parseInt(localStorage.getItem('lastActivityTime') || '0', 10);
  }

  // Check if the session has timed out
  public checkSessionTimeout(): void {
    const lastActivityTime = this.getLastActivityTime();
    if (lastActivityTime) {
      const currentTime = Date.now();
      if (currentTime - lastActivityTime > this.inactivityTimeout) {
        this.logout(); // Log the user out if the session has timed out
      }
    }
  }

  // Log out the user
  public logout(): void {
    localStorage.removeItem('accountRole');
    localStorage.removeItem('username');
    this.router.navigate(['web-payment/loginpage']);
  }

  // Keep resetting the session timeout on user activity
  public resetTimeoutTimer(): void {
    clearTimeout(this.timeoutTimer);
    clearInterval(this.logTimer); // Stop the logging when the timer resets
    // this.startLogTimer(); 
    this.timeoutTimer = setTimeout(() => {
      this.logout(); // Logout after inactivity
    }, this.inactivityTimeout);
  }

  // Start logging the remaining time
  private startLogTimer(): void {
    this.logTimer = setInterval(() => {
      const lastActivityTime = this.getLastActivityTime();
      if (lastActivityTime) {
        const currentTime = Date.now();
        const remainingTime = this.inactivityTimeout - (currentTime - lastActivityTime);
        
        if (remainingTime > 0) {
          console.log(`Remaining time before logout: ${Math.floor(remainingTime / 1000)} seconds`);
        } else {
          console.log('Session expired!');
          this.logout(); // Automatically logout if time is expired
        }
      }
    }, 1000); // Log every second
  }

  // Check if the user is authenticated
  public isAuthenticated(): boolean {
    return localStorage.getItem('accountRole') !== null;
  }

  public resetOnUserActivity(): void {
    if (isPlatformBrowser(this.platformId)) {
      // List of events that reset the timeout on activity
      const events = ['mousemove', 'keydown', 'scroll', 'click'];
      
      events.forEach((event) => {
        window.addEventListener(event, this.handleUserActivity.bind(this));
      });
    }
  }

  // Handle user activity
  private handleUserActivity(): void {
    // console.log('User activity detected');
    this.setLastActivityTime();
    this.resetTimeoutTimer(); // Reset the session timeout when there's user activity
  }
}
