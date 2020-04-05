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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookPageRoutingModule {}
