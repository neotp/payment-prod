import { Routes } from '@angular/router';
import { LoginpageComponent } from './component/loginpage/loginpage.component';
import { RegispageComponent } from './component/regispage/regispage.component';
import { PymntpageComponent } from './component/pymntpage/pymntpage.component';
import { MnusrpageComponent } from './component/mnusrpage/mnusrpage.component';
import { KbankcallbackComponent } from './component/kbankcallback/kbankcallback.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'/payment/loginpage',
        pathMatch:'full'
    },
    {
        path:'/payment/loginpage',
        component:LoginpageComponent
    },
    {
        path:'/payment/regispage',
        component:RegispageComponent
    },
    {
        path:'/payment/pymntpage',
        component:PymntpageComponent
    },
    {
        path:'/payment/mnusrpage',
        component:MnusrpageComponent
    },
    {
        path:'/payment/callback',
        component:KbankcallbackComponent
    }
];
