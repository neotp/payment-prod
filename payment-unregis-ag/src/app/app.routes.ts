import { Routes } from '@angular/router';
import { PymntpageComponent } from './component/pymntpage/pymntpage.component';
import { LoadingSpinnerComponent } from './component/shared/loading-spinner/loading-spinner.component';
// import { PaymentRedirectComponent } from './component/payment-redirect/payment-redirect.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'pymntpage',  // Default redirect
        pathMatch: 'full'
    },
    {
        path: 'pymntpage',
        component: PymntpageComponent,
    },
    {
        path: 'loading',
        component: LoadingSpinnerComponent
    },
    // {
    //     path: 'payment-redirect',
    //     component: PaymentRedirectComponent 
    // },
    {
        path: '**', 
        redirectTo: 'pymntpage',
        pathMatch: 'full'
    }
];
