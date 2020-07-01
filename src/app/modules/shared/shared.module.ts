import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';
import { CustomCalendarComponent } from 'src/app/components/shared/custom-calendar/custom-calendar.component';
import { CalendarModule } from 'ion2-calendar';



@NgModule({
  declarations: [
    ResultSortingComponent,
    ResultListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatExpansionModule,
    CalendarModule
  ],
  exports: [
    ResultSortingComponent,
    ResultListComponent,
    MatExpansionModule
  ]
})
export class SharedModule { }
