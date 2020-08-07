import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookPage } from './book.page';

const routes: Routes = [
  {
    path: '',
    component: BookPage,
    children: [
      {
        path: 'flight',
        loadChildren: () => import('./flight/flight.module').then(m => m.FlightPageModule)
      },
      {
        path: 'hotel',
        loadChildren: () => import('./hotel/hotel.module').then(m => m.HotelPageModule)
      },
      {
        path: 'bus',
        loadChildren: () => import('./bus/bus.module').then(m => m.BusPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookPageRoutingModule {}
