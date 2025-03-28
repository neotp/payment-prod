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

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'loginpage',
        pathMatch: 'full'
    },
    {
        path: 'loginpage',
        component: LoginpageComponent
    },
    {
        path: 'regispage',
        component: RegispageComponent
    },
    {
        path: 'pymntpage',
        component: PymntpageComponent,
        canActivate: [AuthGuard] 
    },
    {
        path: 'mnusrpage',
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
        path: 'history-header',
        component: Hispage001aComponent 
    },
    {
        path: 'history-detail',
        component: Hispage001bComponent 
    },
    {
        path: '**', 
        redirectTo: 'loginpage',
        pathMatch: 'full'
    }
];
