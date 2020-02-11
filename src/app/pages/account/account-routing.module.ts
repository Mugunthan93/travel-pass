import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPage } from './account.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
    children: [
      {
        path:'dashboard',
        loadChildren:'./dashboard/dashboard.module#DashboardPageModule'
      },
      {
        path:'onboard',
        loadChildren:'./onboard/onboard.module#OnboardPageModule'
      },
      {
        path:'vendor',
        loadChildren:'./vendor/vendor.module#VendorPageModule'
      },
      {
        path:'booking',
        loadChildren:'./booking/booking.module#BookingPageModule'
      },
      {
        path:'invoice',
        loadChildren:'./invoice/invoice.module#InvoicePageModule'
      },
      {
        path:'',
        redirectTo:'/account/onboard',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
