import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { CnList } from '../../../interface/payment-interface';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input() title: string = '';
  @Input() text_button: string = 'Ok';
  @Input() message?: string; // Optional message
  @Input() messageDelete?: string; // Optional message
  @Input() message_list: CnList[] = [];
  @Input() headerColor: string = '#FFFFFF'; // Default color
  @Input() confirmButton: boolean = false; // Show button by default
  @Input() closeButton: boolean = false; // Show button by default
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  public isMobile: boolean = false;  
  private isBrowser: boolean; 

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
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
  
}
