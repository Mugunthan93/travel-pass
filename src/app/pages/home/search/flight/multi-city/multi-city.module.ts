import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiCityPageRoutingModule } from './multi-city-routing.module';

import { MultiCityPage } from './multi-city.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MultiCityPageRoutingModule
  ],
  declarations: [
    MultiCityPage
  ]
})
export class MultiCityPageModule {}
