import { State, Selector, Action, StateContext } from '@ngxs/store';
import { flightSearchResult } from 'src/app/models/search/flight';

export interface flight{
    onewayResponse: flightSearchResult
    roundtripResponse: flightSearchResult
    multicityResponse: flightSearchResult
}

export class OneWayResponse{
    static readonly type = '[FlightResult] OneWayResponse';
    constructor(public response: flightSearchResult) {
        
    }
}

export class RoundTripResponse {
    static readonly type = '[FlightResult] RoundTripResponse';
    constructor(public response: flightSearchResult) {

    }
}

export class MultiCityResponse {
    static readonly type = '[FlightResult] MultiCityResponse';
    constructor(public response: flightSearchResult) {

    }
}


@State<flight>({
    name: 'Flight',
    defaults: {
        onewayResponse: null,
        roundtripResponse: null,
        multicityResponse: null
    }
})
export class FlightResultState{

    constructor() {

    }

    @Action(OneWayResponse)
    onewayResponse(states: StateContext<flight>, action: OneWayResponse) {
        states.patchState({
            onewayResponse: action.response
        });
    }

    @Action(RoundTripResponse)
    roundtripResponse(states: StateContext<flight>, action: RoundTripResponse) {
        states.patchState({
            roundtripResponse: action.response
        });
    }

    @Action(MultiCityResponse)
    multicityResponse(states: StateContext<flight>, action: MultiCityResponse) {
        states.patchState({
            multicityResponse: action.response
        });
    }

}