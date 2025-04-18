import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'web-payment',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'web-payment/loginpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'web-payment/regispage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'web-payment/pymntpage',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'web-payment/mnusrpage',
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
    path: 'web-payment/history-header',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'web-payment/history-detail',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'web-payment/forgot-password',
    renderMode: RenderMode.Prerender,
  },
  {
      path: '**',
      renderMode: RenderMode.Prerender,
  }
];
