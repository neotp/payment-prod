import { Component, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Login } from '../../interface/loginpage-interface';
import { ApiService } from '../../service/api.service';
import { PopupComponent } from '../shared/popup/popup.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  imports: [ 
    FormsModule
    , ReactiveFormsModule
    , RouterLink
    , PopupComponent
    , CommonModule],
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css'],
})
export class LoginpageComponent implements OnInit {
  public loginForm!: FormGroup;
  public warning_pop: boolean = false;
  public success_pop: boolean = false;
  public blank_pop: boolean = false;
  public loginData = {} as Login;
  public regis: string | null = null;
  public isMobile: boolean = false; 
  private isBrowser: boolean; 

  constructor(
    private router: Router
    , private formBuilder: FormBuilder
    , private api: ApiService
    , private route: ActivatedRoute
    , private authService: AuthService // Inject the AuthService
    , @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loginForm = this.formBuilder.group({
      usr: [{ value: null, disabled: false }, [Validators.required]]
      , pss: [{ value: null, disabled: false }, [Validators.required]]
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  public ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
    this.loginForm.reset();
    this.clearValue();
    this.route.queryParams.subscribe(params => {
      this.regis = params['regis'];
      console.log(this.regis);
      if (this.regis === 'success'){
          this.popup('success');
          this.router.navigate([], {
            queryParams: { regis: null },
            queryParamsHandling: 'merge'
          });
      }
    });
    this.authService.checkSessionTimeout(); // Check session timeout when component loads
  }

  public checkScreenSize() {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  public onSubmit() {
    console.log(this.loginForm.value);
  }

  private populateForm(): void {
    this.loginData.username = this.loginForm.controls['usr'].value;
    this.loginData.password = this.loginForm.controls['pss'].value;
  }

  private clearValue(): void {
    this.loginForm.controls['usr'].setValue('');
    this.loginForm.controls['pss'].setValue('');
  }

  public login(): void {
    this.populateForm();
    if (!this.loginData.username || !this.loginData.password) {
      this.popup('blank')
    } else {
      this.api.login(this.loginData).subscribe(
        (result: any) => {
  
          if (result.role === 'admin' || result.role === 'user') {
            localStorage.setItem('accountRole', result.role);
            localStorage.setItem('username', this.loginData.username);
            console.log('role', localStorage.getItem('accountRole'));
  
            const queryParams = {
              username: this.loginData.username,
              role: result.role
            };
  
            if (result.role === 'admin') {
              this.router.navigate(['mnusrpage'], { queryParams , queryParamsHandling: 'preserve'} );
            } else if (result.role === 'user') {
              this.router.navigate(['pymntpage'], { queryParams , queryParamsHandling: 'preserve'});
            }

            // After successful login, set the last activity time and reset the timeout timer
            this.authService.setLastActivityTime();
            this.authService.resetTimeoutTimer();
          } else {
            this.popup('notfound');
          }
      }, (error: any) => {
        console.log('Error during login:', error);
      });
    }
  }

  public register(): void {
    this.router.navigate(['regispage']);
  }

  public handleConfirm(pop: string) {
    switch (pop) {
      case 'notfound':
        this.warning_pop = false;
        break;
      case 'success':
        this.success_pop = false;
        break;
      case 'blank':
        this.blank_pop = false;
        break;
    }
  }

  public popup(pop: string) {
    switch (pop) {
      case 'notfound':
        this.warning_pop = true;
        break;
      case 'success':
        this.success_pop = true;
        break;
      case 'blank':
        this.blank_pop = true;
        break;
    }
  }
}
