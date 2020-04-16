import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { FairSummaryComponent } from 'src/app/components/flight/fair-summary/fair-summary.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
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
    ResultListComponent,
    FairSummaryComponent,
    MatExpansionModule
  ]
})
export class SharedModule { }
