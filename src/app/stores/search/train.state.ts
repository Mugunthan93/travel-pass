import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TrainOneWaySearchState } from './train/oneway.state';
import { TrainRoundTripSearchState } from './train/round-trip.state';
import { TrainMultiCitySearchState } from './train/multi-city.state';

export interface trainsearch {
    JourneyType: number,
    trainType : string
}


/////////////////////////////////////////////////////

export class JourneyType {
    static readonly type = "[train_search] JourneyType";
    constructor(public type: string) {

    }
}

export class TrainType {
    static readonly type = "[train_search] TrainType";
    constructor(public type: string) {

    }
}

@State<trainsearch>({
    name: 'train_search',
    defaults: {
        JourneyType: 1,
        trainType : 'domestic'
    },
    children: [
        TrainOneWaySearchState,
        TrainRoundTripSearchState,
        TrainMultiCitySearchState
    ]
})
export class TrainSearchState {

    constructor(
    ) {

    }

    @Selector()
    static getJourneyType(states: trainsearch): number {
        return states.JourneyType;
    }

    @Selector()
    static getTrainType(states: trainsearch): string {
        return states.trainType;
    }

    @Action(JourneyType)
    journeyType(states: StateContext<trainsearch>, action: JourneyType) {
        if (action.type == "one-way") {
            states.patchState({
                JourneyType: 1
            });
        }
        else if (action.type == "round-trip") {
            states.patchState({
                JourneyType: 2
            });
        }
        else if (action.type == "multi-city") {
            states.patchState({
                JourneyType: 3
            });
        }
    }

    @Action(TrainType)
    trainType(states: StateContext<trainsearch>, action: TrainType) {
        states.patchState({
            trainType : action.type
        });
    }


}