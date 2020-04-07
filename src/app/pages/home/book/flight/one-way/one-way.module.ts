import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneWayPageRoutingModule } from './one-way-routing.module';

import { OneWayPage } from './one-way.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { FairSummaryComponent } from 'src/app/components/fair-summary/fair-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OneWayPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    OneWayPage,
    FairSummaryComponent
  ]
})
export class OneWayPageModule {}
