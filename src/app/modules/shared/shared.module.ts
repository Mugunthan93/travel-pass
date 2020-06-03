import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { FairSummaryComponent } from 'src/app/components/flight/fair-summary/fair-summary.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';



@NgModule({
  declarations: [
    ResultSortingComponent,
    ResultListComponent,
    FairSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatExpansionModule,
  ],
  exports: [
    ResultSortingComponent,
    ResultListComponent,
    FairSummaryComponent,
    MatExpansionModule
  ]
})
export class SharedModule { }
