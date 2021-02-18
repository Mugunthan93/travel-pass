import { NgModule } from '@angular/core';
import { SortPipe } from '../pipes/sort/sort.pipe';
import { RoomPipe } from '../pipes/room/room.pipe';
import { LimitPipe } from '../pipes/limit/limit.pipe';

@NgModule({
    declarations: [
        SortPipe,
        RoomPipe,
        LimitPipe
    ],
    exports: [
        SortPipe,
        RoomPipe,
        LimitPipe
    ]
})

export class PipeModule { }
