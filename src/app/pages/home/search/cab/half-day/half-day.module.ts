import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HalfDayPageRoutingModule } from './half-day-routing.module';

import { HalfDayPage } from './half-day.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HalfDayPageRoutingModule
  ],
  declarations: [HalfDayPage]
})
export class HalfDayPageModule {}
