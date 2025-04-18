import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the user is logged in and has valid role', () => {
    spyOn(localStorage, 'getItem').and.returnValue('admin'); // Simulate logged-in admin

    const route = {
      routeConfig: {
        path: 'mnusrpage'
      }
    } as ActivatedRouteSnapshot; // Mock the ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot; // Mock the RouterStateSnapshot

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should return true if the user is logged in as user and has valid role', () => {
    spyOn(localStorage, 'getItem').and.returnValue('user'); // Simulate logged-in user

    const route = {
      routeConfig: {
        path: 'pymntpage'
      }
    } as ActivatedRouteSnapshot; // Mock the ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot; // Mock the RouterStateSnapshot

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should navigate to login and return false if user is not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Simulate not logged in
    const navigateSpy = spyOn(router, 'navigate');

    const route = {} as ActivatedRouteSnapshot; // Mock the ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot; // Mock the RouterStateSnapshot

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['web-payment/loginpage']);
  });

  it('should navigate to pymntpage if user does not have permission', () => {
    spyOn(localStorage, 'getItem').and.returnValue('user'); // Simulate logged-in user

    const route = {
      routeConfig: {
        path: 'mnusrpage'
      }
    } as ActivatedRouteSnapshot; // Mock the ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot; // Mock the RouterStateSnapshot
    const navigateSpy = spyOn(router, 'navigate');

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['web-payment/pymntpage']);
  });
});
