import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CreatUser } from '../../../interface/manageuser-interface';

@Component({
  selector: 'app-creusr-popup',
    imports: [
        CommonModule
        , FormsModule
        , LoadingSpinnerComponent
        , ReactiveFormsModule
        ],
  templateUrl: './creusr-popup.component.html',
  styleUrl: './creusr-popup.component.css'
})
export class CreusrPopupComponent {
  @Input() title: string = 'For Order Release';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<CreatUser>();

  public headerForm!: FormGroup;
  public usageOption: string = '';
  public isLoading = false;
  public creatUser = {} as CreatUser;
  public isMobile: boolean = false;  
  private isBrowser: boolean; 


  constructor(
      private formBuilder: FormBuilder,
      @Inject(PLATFORM_ID) private platformId: Object
    ){ 
      this.isBrowser = isPlatformBrowser(this.platformId);
      this.headerForm = this.formBuilder.group({
      username: [{ value: null, disabled: false }, Validators.required]
      , password: [{ value: null, disabled: false }, Validators.required]
      , fstname: [{ value: null, disabled: false }, Validators.required]
      , lstname: [{ value: null, disabled: false }, Validators.required]
      , email: [{ value: null, disabled: false }, Validators.required]
      , pos: [{ value: null, disabled: false }, Validators.required]
      , role: [{ value: 'user', disabled: false }, Validators.required]
    });}


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
    this.creatUser.username = this.headerForm.controls['username'].value;
    this.creatUser.password   = this.headerForm.controls['password'].value;
    this.creatUser.fstname   = this.headerForm.controls['fstname'].value;
    this.creatUser.lstname   = this.headerForm.controls['lstname'].value;
    this.creatUser.email  = this.headerForm.controls['email'].value;
    this.creatUser.pos   = this.headerForm.controls['pos'].value;
    this.creatUser.role    = this.headerForm.controls['role'].value;
  }

  public closePopup() {
    this.close.emit();
  }

  public confirmAction() {
    this.populateForm();
    this.confirm.emit({ 
     username: this.creatUser.username
      , password: this.creatUser.password  
      , fstname: this.creatUser.fstname  
      , lstname: this.creatUser.lstname  
      , email: this.creatUser.email 
      , pos: this.creatUser.pos  
      , role: this.creatUser.role   
    });
    
    this.closePopup();
  }
  
  public setLoading(isLoading: boolean) {
    console.log('Loading status:', isLoading); // Debug
    this.isLoading = isLoading;
  }
  
}
