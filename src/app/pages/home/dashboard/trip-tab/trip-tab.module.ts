import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripTabPageRoutingModule } from './trip-tab-routing.module';

import { TripTabPage } from './trip-tab.page';
import { PipeModule } from 'src/app/modules/pipe.module';
import { ViewRequestComponent } from 'src/app/components/shared/view-request/view-request.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    TripTabPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    TripTabPage,
    ViewRequestComponent
  ],
  entryComponents : [
    ViewRequestComponent
  ]
})
export class TripTabPageModule {}
