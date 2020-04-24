import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarePageRoutingModule } from './fare-routing.module';

import { FarePage } from './fare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarePageRoutingModule
  ],
  declarations: [FarePage]
})
export class FarePageModule {}
