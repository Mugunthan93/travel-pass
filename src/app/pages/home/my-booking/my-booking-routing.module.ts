import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBookingPage } from './my-booking.page';

const routes: Routes = [
  {
    path: ':bookingType',
    component: MyBookingPage,
    children: [
      {
        path: 'new',
        loadChildren: () => import('./new/new.module').then(m => m.NewPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
      },
      {
        path: '',
        redirectTo: '/home/my-booking/flight/new',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyBookingPageRoutingModule {}
