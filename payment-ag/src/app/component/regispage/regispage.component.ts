import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder, FormsModule  } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../../interface/register-interface';
import { ApiService } from '../../service/api.service';
import { PopupComponent } from '../popup/popup.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [ 
    FormsModule 
    ,ReactiveFormsModule
    , CommonModule
    , RouterLink
    , PopupComponent
  ]
  , selector: 'app-regispage'
  , templateUrl: './regispage.component.html'
  , styleUrls: ['./regispage.component.css'
    
  ]
})
export class RegispageComponent implements OnInit {
  public registerForm: FormGroup;
  public dup_pop: boolean = false;
  public success_pop: boolean = false;
  public fail_pop: boolean = false;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);

  public registerData = {} as Register;
  constructor(
    private router: Router
    , private formBuilder: FormBuilder
        , private api: ApiService
  ) {
    this.registerForm = this.formBuilder.group({
      fstname: [{ value: null, disabled: false }, [Validators.required]]
      , lstname: [{ value: null, disabled: false }, [Validators.required]]
      , customercode: [{ value: null, disabled: false }, [Validators.required]]
      , customername: [{ value: null, disabled: false }, [Validators.required]]
      , username: [{ value: null, disabled: false }, [Validators.required]]
      , password: [{ value: null, disabled: false }, [Validators.required]]
      , email: [{ value: null, disabled: false }, [Validators.required]]
      , position: [{ value: null, disabled: false }, [Validators.required]]
    });}

  public ngOnInit(): void {
  //
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

  public onSubmit(): void {
    this.populateForm();
    if (this.registerForm.valid) {
        this.api.register(this.registerData).subscribe((result: any) => {
          if(result.regis === 'success') {
            this.router.navigate(['payment/loginpage'], {queryParams: { regis: result.regis } });
          } else if (result.regis === 'dup') {
            this.popup('dup')
          } else {
            this.popup('fail')
          }
        }, (error: any) => {
          console.log('Error during login:', error);
        });
    }
  }

  
  public popup(pop: string) {
    switch (pop) {
      case 'dup':
        this.dup_pop = true;
        break;
      case 'fail':
        this.fail_pop = true;
        break;
      case 'success':
        this.success_pop = true;
        break;
    }
  }

  public handleConfirm(pop: string) {
    switch (pop) {
      case 'dup':
        this.dup_pop = false;
        break;
      case 'fail':
        this.fail_pop = false;
        break;
      case 'success':
        this.success_pop = false;
        break;
    }
  }

  public setLoading(isLoading: boolean): void {
    this.loadingApp.emit(isLoading);
  }

}
