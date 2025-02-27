import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { RecaptchaModule } from 'ng-recaptcha';


@Component({
  selector: 'app-root',
  imports: [
     RouterOutlet,
     NavbarComponent,
     RecaptchaModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'payment-ag';

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('accountRole');
  }
  
  public username(): string | null {
    return localStorage.getItem('username');
  }
  
  
}
