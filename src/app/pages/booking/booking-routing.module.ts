import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingPage } from './booking.page';

const routes: Routes = [
  {
    path: '',
    component: BookingPage,
    children : [
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'result',
        loadChildren: () => import('./result/result.module').then( m => m.ResultPageModule)
      },
      { path: '', redirectTo: '/booking/search', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/booking/search', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingPageRoutingModule {}
