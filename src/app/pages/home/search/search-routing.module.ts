import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchPage } from './search.page';

const routes: Routes = [
  {
    path: '',
    component: SearchPage,
    children:[
      {
        path: 'flight',
        loadChildren: () => import('./flight/flight.module').then( m => m.FlightPageModule)
      },
      {
        path: 'bus',
        loadChildren: () => import('./bus/bus.module').then( m => m.BusPageModule)
      },
      {
        path: 'hotel',
        loadChildren: () => import('./hotel/hotel.module').then( m => m.HotelPageModule)
      },
      {
        path: 'cab',
        loadChildren: () => import('./cab/cab.module').then( m => m.CabPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchPageRoutingModule { }
