import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultListComponent } from 'src/app/components/result-list/result-list.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    ResultListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatExpansionModule
  ],
  exports: [
    ResultListComponent
  ]
})
export class SharedModule { }
