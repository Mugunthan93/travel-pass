import { State, Action, StateContext, Selector, Select } from '@ngxs/store';
import { city } from '../shared.state';
import { OneWaySearchState } from './flight/oneway.state';
import { RoundTripSearchState } from './flight/round-trip.state';
import { MultiCitySearchState } from './flight/multi-city.state';

//interfaces

export interface flight{
    JourneyType : number
}

export interface trips {
    from: city
    to: city
    departure: Date
}

export interface traveller {
    child: number
    infant: number
    adult: number
}


//class

export class JourneyType {
    static readonly type = "[Flight] FlightType";
    constructor(public type : string) {

    }
}

@State<flight>({
    name: 'flight_search',
    defaults: {
        JourneyType : 1
    },
    children: [
        OneWaySearchState,
        RoundTripSearchState,
        MultiCitySearchState
    ]
})
export class FlightSearchState {

    constructor(
    ) {

    }

    @Selector()
    static getJourneyType(states: flight) : number {
        return states.JourneyType;
    }

    @Action(JourneyType)
    journeyType(states: StateContext<flight>, action: JourneyType) {
        if (action.type == "one-way") {
            states.patchState({
                JourneyType:1
            });
        }
        else if (action.type == "round-trip") {
            states.patchState({
                JourneyType:2
            });
        }
        else if (action.type == "multi-city") {
            states.patchState({
                JourneyType:3
            });
        }
    }
    
}