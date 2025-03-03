import { Routes } from '@angular/router';
import { LoginpageComponent } from './component/loginpage/loginpage.component';
import { RegispageComponent } from './component/regispage/regispage.component';
import { PymntpageComponent } from './component/pymntpage/pymntpage.component';
import { MnusrpageComponent } from './component/mnusrpage/mnusrpage.component';
import { KbankcallbackComponent } from './component/kbankcallback/kbankcallback.component';
import { AuthGuard } from './auth.guard';
import { LoadingSpinnerComponent } from './component/shared/loading-spinner/loading-spinner.component';
import { PaymentRedirectComponent } from './component/payment-redirect/payment-redirect.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'payment/loginpage',  // Default redirect
        pathMatch: 'full'
    },
    {
        path: 'payment/loginpage',
        component: LoginpageComponent
    },
    {
        path: 'payment/regispage',
        component: RegispageComponent
    },
    {
        path: 'payment/pymntpage',
        component: PymntpageComponent,
        canActivate: [AuthGuard] 
    },
    {
        path: 'payment/mnusrpage',
        component: MnusrpageComponent,
        canActivate: [AuthGuard] 
    },
    {
        path: 'payment/callback',
        component: KbankcallbackComponent
    },
    {
        path: 'payment/loading',
        component: LoadingSpinnerComponent
    },
    {
        path: 'payment/payment-redirect',
        component: PaymentRedirectComponent 
    },
    {
        path: '**', 
        redirectTo: 'payment/loginpage',
        pathMatch: 'full'
    }
];
