import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSeatPageRoutingModule } from './select-seat-routing.module';

import { SelectSeatPage } from './select-seat.page';
import { BusReviewComponent } from 'src/app/components/bus/bus-review/bus-review.component';
import { BusPhotoComponent } from 'src/app/components/bus/bus-photo/bus-photo.component';
import { BusPolicyComponent } from 'src/app/components/bus/bus-policy/bus-policy.component';
import { BusAmentiesComponent } from 'src/app/components/bus/bus-amenties/bus-amenties.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { BusSeatlayoutComponent } from 'src/app/components/bus/bus-seatlayout/bus-seatlayout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSeatPageRoutingModule,
    MatGridListModule
  ],
  declarations: [
    SelectSeatPage,
    BusReviewComponent,
    BusPhotoComponent,
    BusPolicyComponent,
    BusAmentiesComponent,
    BusSeatlayoutComponent
  ],
  entryComponents: [
    BusReviewComponent,
    BusPhotoComponent,
    BusPolicyComponent,
    BusAmentiesComponent
  ]
})
export class SelectSeatPageModule {}
