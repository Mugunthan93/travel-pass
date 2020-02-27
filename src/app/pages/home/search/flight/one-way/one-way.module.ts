import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneWayPageRoutingModule } from './one-way-routing.module';

import { OneWayPage } from './one-way.page';
import { SelectCityComponent } from 'src/app/components/select-city/select-city.component';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OneWayPageRoutingModule
  ],
  declarations: [
    OneWayPage,
    SelectCityComponent,
    CityModalComponent 
  ],
  entryComponents:[CityModalComponent]
})
export class OneWayPageModule {}
