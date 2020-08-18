import { NgModule } from '@angular/core';
import { SortPipe } from '../pipes/sort/sort.pipe';
import { RoomPipe } from '../pipes/room/room.pipe';

@NgModule({
    declarations: [
        SortPipe,
        RoomPipe
    ],
    exports: [
        SortPipe,
        RoomPipe
    ]
})

export class PipeModule { }
