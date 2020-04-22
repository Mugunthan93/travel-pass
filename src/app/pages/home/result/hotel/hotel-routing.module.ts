import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotelPage } from './hotel.page';
import { ViewHotelComponent } from 'src/app/components/hotel/view-hotel/view-hotel.component';
import { RoomListComponent } from 'src/app/components/hotel/room-list/room-list.component';

const routes: Routes = [
  {
    path: '',
    component: HotelPage,
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelPageRoutingModule {}
