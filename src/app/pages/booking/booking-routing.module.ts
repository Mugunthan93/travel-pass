import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingPage } from './booking.page';
import { SearchPage } from './search/search.page';
import { ResultPage } from './result/result.page';

const routes: Routes = [
  {
    path: '',
    component: BookingPage,
    children : [
      {
        path: 'search',
        component : SearchPage
      },
      {
        path: 'result',
        component : ResultPage
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
