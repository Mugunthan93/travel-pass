import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherRequestPageRoutingModule } from './other-request-routing.module';

import { OtherRequestPage } from './other-request.page';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    OtherRequestPageRoutingModule
  ],
  declarations: [OtherRequestPage]
})
export class OtherRequestPageModule {}
