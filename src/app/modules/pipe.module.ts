import { NgModule } from '@angular/core';
import { SortPipe } from '../pipes/sort/sort.pipe';

@NgModule({
    declarations: [
        SortPipe
    ],
    exports: [
        SortPipe
    ]
})

export class PipeModule { }
