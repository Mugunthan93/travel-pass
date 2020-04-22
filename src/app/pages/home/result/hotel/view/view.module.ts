import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPageRoutingModule } from './view-routing.module';

import { ViewPage } from './view.page';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { SimilarHotelsComponent } from 'src/app/components/hotel/similar-hotels/similar-hotels.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPageRoutingModule,
    MatGridListModule,
    MatDividerModule
  ],
  declarations: [
    ViewPage,
    SimilarHotelsComponent
  ]
})
export class ViewPageModule {}
