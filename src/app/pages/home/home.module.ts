import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { AboutHotelComponent } from 'src/app/components/hotel/about-hotel/about-hotel.component';
import { MenuBarComponent } from 'src/app/components/menu-bar/menu-bar.component';
import { PipeModule } from 'src/app/modules/pipe.module';
import { CityModalComponent } from 'src/app/components/shared/city-modal/city-modal.component';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    HomePageRoutingModule,
    PipeModule
  ],
  declarations: [
    HomePage,
    AboutHotelComponent,
    MenuBarComponent,
    CityModalComponent,
    SelectModalComponent
  ],
  entryComponents: [
    AboutHotelComponent,
    CityModalComponent,
    SelectModalComponent
  ]
})
  
export class HomePageModule {

}
