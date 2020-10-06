import { State } from "@ngxs/store";
import { TrainOneWayBookState } from './train/one-way.state';
import { TrainRoundTripBookState } from './train/round-trip.state';
import { TrainMultiCityBookState } from './train/multi-city.state';

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

export class TrainBookState {

    constructor() {

    }

}