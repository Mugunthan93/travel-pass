import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
<<<<<<< HEAD
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'result',
        loadChildren: () => import('./result/result.module').then(m => m.ResultPageModule)
      },
      {
        path: 'book',
        loadChildren: () => import('./book/book.module').then(m => m.BookPageModule)
      },
      {
        path: '',
        redirectTo: '/home/dashboard/home-tab',
=======
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'booking',
        loadChildren: () => import('./booking/booking.module').then(m => m.BookingPageModule)
      },
      {
        path: '',
        redirectTo: '/home/booking/dashboard',
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
<<<<<<< HEAD
    redirectTo: '/home/dashboard/home-tab',
=======
    redirectTo: '/home/booking/dashboard',
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
