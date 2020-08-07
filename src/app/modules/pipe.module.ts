import { NgModule } from '@angular/core';
import { SortPipe } from '../pipes/sort/sort.pipe';
import { LimitPipe } from '../pipes/limit/limit.pipe';

@NgModule({
    declarations: [
        SortPipe,
        LimitPipe
    ],
    exports: [
        SortPipe,
        LimitPipe
    ]
})

export class PipeModule { }
