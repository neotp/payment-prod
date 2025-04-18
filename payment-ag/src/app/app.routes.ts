import { Routes } from '@angular/router';
import { LoginpageComponent } from './component/loginpage/loginpage.component';
import { RegispageComponent } from './component/regispage/regispage.component';
import { PymntpageComponent } from './component/pymntpage/pymntpage.component';
import { MnusrpageComponent } from './component/mnusrpage/mnusrpage.component';
import { KbankcallbackComponent } from './component/kbankcallback/kbankcallback.component';
import { AuthGuard } from './auth.guard';
import { LoadingSpinnerComponent } from './component/shared/loading-spinner/loading-spinner.component';
import { PaymentRedirectComponent } from './component/payment-redirect/payment-redirect.component';
import { Hispage001aComponent } from './component/historypage/hispage001a/hispage001a.component';
import { Hispage001bComponent } from './component/historypage/hispage001b/hispage001b.component';
import { NotFoundComponent } from './component/shared/not-found/not-found.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: 'web-payment',
        redirectTo:'web-payment/loginpage',
        pathMatch:'full'
    },
    {
        path: 'web-payment/loginpage',
        component: LoginpageComponent
    },
    {
        path: 'web-payment/regispage',
        component: RegispageComponent
    },
    {
        path: 'web-payment/pymntpage',
        component: PymntpageComponent,
        canActivate: [AuthGuard] 
    },
    {
        path: 'web-payment/mnusrpage',
        component: MnusrpageComponent,
        canActivate: [AuthGuard] 
    },
    {
        path: 'callback',
        component: KbankcallbackComponent
    },
    {
        path: 'loading',
        component: LoadingSpinnerComponent
    },
    {
        path: 'payment-redirect',
        component: PaymentRedirectComponent 
    },
    {
        path: 'web-payment/history-header',
        component: Hispage001aComponent 
    },
    {
        path: 'web-payment/history-detail',
        component: Hispage001bComponent 
    },
    {
        path: 'web-payment/forgot-password',
        component: ForgotPasswordComponent 
    },
    {
        path: '**',  // Wildcard route for 404 handling
        component: NotFoundComponent
    }
];
