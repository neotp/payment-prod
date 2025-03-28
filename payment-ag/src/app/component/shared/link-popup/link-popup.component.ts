import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-link-popup',
  imports: [CommonModule
      , FormsModule],
  templateUrl: './link-popup.component.html',
  styleUrl: './link-popup.component.css'
})
export class LinkPopupComponent {
  @Input() title: string = '';
  @Input() text_button: string = 'Ok';
  @Input() linkToCopy: string = ''; 
  @Input() headerColor: string = '#FFFFFF'; // Default color
  @Input() confirmButton: boolean = false; // Show button by default
  @Input() closeButton: boolean = false; // Show button by default
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  public isMobile: boolean = false;  
  private isBrowser: boolean; 

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  
  public copyLink(): void {
    navigator.clipboard.writeText(this.linkToCopy).then(
      () => {
        alert('Link copied: ' + this.linkToCopy);
      },
      (err) => {
        console.error('Failed to copy: ', err);
      }
    ); 
  }

  public closePopup() {
    this.close.emit();
  }

  public confirmAction() {
    this.confirm.emit();
    this.closePopup();
  }
  public closeAction() {
    this.close.emit();
    this.closePopup();
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
  
}
