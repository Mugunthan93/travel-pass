import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { TripComponent } from 'src/app/components/expense/trip/trip.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    DashboardPageRoutingModule
  ],
  declarations: [
    DashboardPage,
    TripComponent
  ],
  entryComponents : [
    TripComponent
  ]
})
export class DashboardPageModule {}
