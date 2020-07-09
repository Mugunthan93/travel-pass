import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'ion2-calendar';
import { PipeModule } from '../pipe.module';



@NgModule({
  declarations: [
    ResultListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatExpansionModule,
    CalendarModule,
    PipeModule
  ],
  exports: [
    ResultListComponent,
    MatExpansionModule
  ]
})
export class SharedModule { }
