import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CabPageRoutingModule } from './cab-routing.module';

import { CabPage } from './cab.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatExpansionModule,
    MatDividerModule,
    CabPageRoutingModule
  ],
  declarations: [CabPage]
})
export class CabPageModule {}
