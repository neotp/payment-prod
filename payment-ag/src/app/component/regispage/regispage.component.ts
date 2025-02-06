import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder, FormsModule  } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../../interface/register-interface';
import { ApiService } from '../../service/api.service';

@Component({
  imports: [ FormsModule ,ReactiveFormsModule, RouterLink]
  , selector: 'app-regispage'
  , templateUrl: './regispage.component.html'
  , styleUrls: ['./regispage.component.css'
    
  ]
})
export class RegispageComponent implements OnInit {
  public registerForm: FormGroup;
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
    if (this.registerForm.valid) {
        // this.api.register(this.registerData).subscribe((result: any) => {
        //   if(result.role === 'admin') {
            this.router.navigate(['/pymntpage'], {queryParams: this.registerData});
          // } else {
            // this.router.navigate(['/mnusrpage'], {queryParams: this.registerData});
          // }
        // }, (error: any) => {
        //   console.log('Error during login:', error);
        // });
    }
  }

  public setLoading(isLoading: boolean): void {
    this.loadingApp.emit(isLoading);
  }

}
