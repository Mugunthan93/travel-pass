import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusPageRoutingModule } from './bus-routing.module';

import { BusPage } from './bus.page';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusPageRoutingModule,
    MatDividerModule,
    MatExpansionModule
  ],
  declarations: [BusPage]
})
export class BusPageModule {}
