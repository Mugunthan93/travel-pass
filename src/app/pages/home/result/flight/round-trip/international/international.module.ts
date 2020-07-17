import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InternationalPageRoutingModule } from './international-routing.module';

import { InternationalPage } from './international.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InternationalPageRoutingModule,
    SharedModule,
    MatExpansionModule
  ],
  declarations: [InternationalPage]
})
export class InternationalPageModule {}
