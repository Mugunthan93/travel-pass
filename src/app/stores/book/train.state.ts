import { State } from "@ngxs/store";
import { TrainOneWayBookState } from './train/one-way.state';
import { TrainRoundTripBookState } from './train/round-trip.state';
import { TrainMultiCityBookState } from './train/multi-city.state';
import { Injectable } from "@angular/core";

export interface trainbook {

}

@State({
    name: 'train_book',
    defaults: null,
    children: [
        TrainOneWayBookState,
        TrainRoundTripBookState,
        TrainMultiCityBookState
    ]
})

@Injectable()
export class TrainBookState {

    constructor() {

    }

}
