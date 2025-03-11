import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() headerColor: string = '#FFFFFF'; // Default color
  @Input() confirmButton: boolean = false; // Show button by default
  @Input() closeButton: boolean = false; // Show button by default

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  public closePopup() {
    this.close.emit();
  }

  public confirmAction() {
    this.confirm.emit();
    this.closePopup();
  }
  
}
