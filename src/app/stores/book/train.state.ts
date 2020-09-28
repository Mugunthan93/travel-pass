import { State } from "@ngxs/store";
import { TrainOneWayBookState } from './train/one-way.state';

export interface trainbook {

}

@State({
    name: 'train_book',
    defaults: null,
    children: [
        TrainOneWayBookState
    ]
})

export class TrainBookState {

    constructor() {

    }

}