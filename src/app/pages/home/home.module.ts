import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { AboutHotelComponent } from 'src/app/components/hotel/about-hotel/about-hotel.component';
import { MenuBarComponent } from 'src/app/components/menu-bar/menu-bar.component';
import { ApproveRequestComponent } from 'src/app/components/flight/approve-request/approve-request.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    AboutHotelComponent,
    MenuBarComponent,
  ],
  entryComponents: [
    AboutHotelComponent
  ]
})
export class HomePageModule {}
