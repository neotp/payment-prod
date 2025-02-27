import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; 
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  imports: [
    ReactiveFormsModule,
    RecaptchaModule 
  ],
  selector: 'app-captcha-popup',
  templateUrl: './captcha-popup.component.html',
  styleUrls: ['./captcha-popup.component.css'], 
})
export class CaptchaPopupComponent {
  @Output() captchaResolved = new EventEmitter<string | null>();

  public onCaptchaCompleted(token: string | null): void {
    this.captchaResolved.emit(token); // Send token back to parent (register.component)
  }

  public closePopup(): void {
    this.captchaResolved.emit(null); // Close popup if canceled
  }
}