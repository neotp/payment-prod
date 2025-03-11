import { RenderMode, ServerRoute } from '@angular/ssr';
import { LoginpageComponent } from './component/loginpage/loginpage.component';
import { RegispageComponent } from './component/regispage/regispage.component';
import { PymntpageComponent } from './component/pymntpage/pymntpage.component';
import { MnusrpageComponent } from './component/mnusrpage/mnusrpage.component';
import { KbankcallbackComponent } from './component/kbankcallback/kbankcallback.component';
import { LoadingSpinnerComponent } from './component/shared/loading-spinner/loading-spinner.component';
import { PaymentRedirectComponent } from './component/payment-redirect/payment-redirect.component';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**', // This will handle fallback routes and prerender other routes
    renderMode: RenderMode.Prerender
  },
  {
    path: '',  // Default redirect path, handled by the Angular Router
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment/loginpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment/regispage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment/pymntpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment/mnusrpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment/callback',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment/loading',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment/payment-redirect',
    renderMode: RenderMode.Prerender,
  },
];
