import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPageRoutingModule } from './new-routing.module';

import { NewPage } from './new.page';
import { SortPipe } from 'src/app/pipes/sort/sort.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPageRoutingModule
  ],
  declarations: [
    NewPage,
    SortPipe
  ]
})
export class NewPageModule {}
