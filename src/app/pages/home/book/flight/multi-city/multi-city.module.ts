import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiCityPageRoutingModule } from './multi-city-routing.module';

import { MultiCityPage } from './multi-city.page';
import { FairSummaryComponent } from 'src/app/components/fair-summary/fair-summary.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MultiCityPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    MultiCityPage,
    FairSummaryComponent
  ]
})
export class MultiCityPageModule {}
