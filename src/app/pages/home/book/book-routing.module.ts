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
      },
      {
        path: 'train',
        loadChildren: () => import('./train/train.module').then( m => m.TrainPageModule)
      },
      {
        path: 'cab',
        loadChildren: () => import('./cab/cab.module').then( m => m.CabPageModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookPageRoutingModule {}
