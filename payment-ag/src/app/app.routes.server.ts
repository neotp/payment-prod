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
    path: 'loginpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'regispage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'pymntpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'mnusrpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'callback',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'loading',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'payment-redirect',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'history-header',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'history-detail',
    renderMode: RenderMode.Prerender,
  },
];
