import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FullDayPageRoutingModule } from './full-day-routing.module';

import { FullDayPage } from './full-day.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullDayPageRoutingModule
  ],
  declarations: [FullDayPage]
})
export class FullDayPageModule {}
