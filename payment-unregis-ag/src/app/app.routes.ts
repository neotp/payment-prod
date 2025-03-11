import { Routes } from '@angular/router';
import { PymntpageComponent } from './component/pymntpage/pymntpage.component';
import { LoadingSpinnerComponent } from './component/shared/loading-spinner/loading-spinner.component';
// import { PaymentRedirectComponent } from './component/payment-redirect/payment-redirect.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'payment/pymntpage',  // Default redirect
        pathMatch: 'full'
    },
    {
        path: 'payment/pymntpage',
        component: PymntpageComponent,
    },
    {
        path: 'payment/loading',
        component: LoadingSpinnerComponent
    },
    // {
    //     path: 'payment/payment-redirect',
    //     component: PaymentRedirectComponent 
    // },
    {
        path: '**', 
        redirectTo: 'payment/pymntpage',
        pathMatch: 'full'
    }
];
