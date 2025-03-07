import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../../interface/register-interface';
import { ApiService } from '../../service/api.service';
import { PopupComponent } from '../shared/popup/popup.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatDialog } from '@angular/material/dialog';
import { CaptchaPopupComponent } from '../shared/captcha-popup/captcha-popup.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  imports: [
    FormsModule
    , ReactiveFormsModule
    , CommonModule
    , RouterLink
    , PopupComponent
    , RecaptchaModule
    , CaptchaPopupComponent
    , LoadingSpinnerComponent
  ]
  , selector: 'app-regispage'
  , templateUrl: './regispage.component.html'
  , styleUrl: './regispage.component.css'
})
export class RegispageComponent implements OnInit {
  public registerForm: FormGroup;
  public dup_pop: boolean = false;
  public success_pop: boolean = false;
  public captcha_cancel_pop: boolean = false;
  public fail_pop: boolean = false;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);
  public captchaToken: string | null = null;
  public showCaptcha: boolean = false; // Flag to show/hide captcha form
  public registerData = {} as Register;
  public siteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  public isSubmitting = false;
  public isLoading = false;
  public isMobile: boolean = false; 
  private isBrowser: boolean; 


  constructor(
    private router: Router
    , private formBuilder: FormBuilder
    , private api: ApiService
    , public dialog: MatDialog
    , @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.registerForm = this.formBuilder.group({
      fstname: [{ value: null, disabled: false }, [Validators.required]]
      , lstname: [{ value: null, disabled: false }, [Validators.required]]
      , customercode: [{ value: null, disabled: false }, [Validators.required]]
      , customername: [{ value: null, disabled: false }, [Validators.required]]
      , username: [{ value: null, disabled: false }, [Validators.required]]
      , password: [{ value: null, disabled: false }, [Validators.required]]
      , email: [{ value: null, disabled: false }, [Validators.required]]
      , position: [{ value: null, disabled: false }, [Validators.required]]
    });
  }

  public ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  
  public checkScreenSize() {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  private populateForm(): void {
    this.registerData.fstname = this.registerForm.controls['fstname'].value;
    this.registerData.lstname = this.registerForm.controls['lstname'].value;
    this.registerData.customercode = this.registerForm.controls['customercode'].value;
    this.registerData.customername = this.registerForm.controls['customername'].value;
    this.registerData.username = this.registerForm.controls['username'].value;
    this.registerData.password = this.registerForm.controls['password'].value;
    this.registerData.email = this.registerForm.controls['email'].value;
    this.registerData.position = this.registerForm.controls['position'].value;
  }

  public onConfirm(): void {
    if (this.registerForm.valid) {
      this.showCaptcha = true; 
    } else {
      alert('Please fill all required fields.');
    }
  }

  public onCaptchaResolved(token: string | null): void { 
    if (token) {
      this.captchaToken = token;
      this.showCaptcha = false; 
      this.submitRegistration();
    } else {
      this.popup('captcha_cancel');
      this.showCaptcha = false; 
    }
  }

  public submitRegistration(): void {
    this.populateForm();
    if (!this.captchaToken) {
      alert('Please complete the CAPTCHA.');
      this.showCaptcha = false; 
      return;
    }
    this.isSubmitting = true;
    this.api.register(this.registerData).subscribe(
      (result: any) => {
        if (result.regis === 'success') {
          this.router.navigate(['payment/loginpage'], {queryParams: { regis: result.regis } , queryParamsHandling: 'preserve'});
        } else {
          this.popup('dup');
        }
      },
      (error: any) => {
        console.error('Error:', error);
        alert('Registration Error');
      }
    );
  }


  public popup(pop: string): void {
    const key = `${pop}_pop` as keyof this;
    if (typeof this[key] === 'boolean') {
      (this[key] as boolean) = true;
    }
  }
  
  public handleConfirm(pop: string): void {
    const key = `${pop}_pop` as keyof this;
    if (typeof this[key] === 'boolean') {
      (this[key] as boolean) = false;
    }
  }
  
 
  public setLoading(isLoading: boolean) {
    console.log('Loading status:', isLoading); // Debug
    this.isLoading = isLoading;
  }
}

