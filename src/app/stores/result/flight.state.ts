import { State, Selector, Action, StateContext } from '@ngxs/store';
import { flightSearchResult, flightResult } from 'src/app/models/search/flight';

export interface flight{
    oneway: onewayResult
    roundtrip: roundtripResult
    multicity: multicityResult
}

export interface onewayResult{
    value: flightResult[]
    traceId: string
}

export interface roundtripResult {
    value: rountripValue
    traceId: string
}

export interface rountripValue{
    departure: flightResult[],
    return: flightResult[]
}

export interface multicityResult {
    value: flightResult[]
    traceId: string
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
    name: 'FlightResult',
    defaults: {
        oneway: null,
        roundtrip: null,
        multicity: null
    }
})
export class FlightResultState{

    constructor() {

    }

    @Selector() 
    static getOneWay(states: flight): flightResult[]{
        return states.oneway.value;
    }

    @Selector()
    static getRoundTrip(states: flight): rountripValue {
        return states.roundtrip.value;
    }

    @Selector()
    static getMultiWay(states: flight): flightResult[] {
        return states.multicity.value;
    }



    @Action(OneWayResponse)
    onewayResponse(states: StateContext<flight>, action: OneWayResponse) {
        console.log(action);
        states.patchState({
            oneway: {
                value: action.response.Results[0],
                traceId: action.response.TraceId
            }
        });
        console.log(states.getState());
    }

    @Action(RoundTripResponse)
    roundtripResponse(states: StateContext<flight>, action: RoundTripResponse) {
        states.patchState({
            roundtrip: {
                value: {
                    departure: action.response.Results[0],
                    return: action.response.Results[1]
                },
                traceId: action.response.TraceId
            }
        });
    }

    @Action(MultiCityResponse)
    multicityResponse(states: StateContext<flight>, action: MultiCityResponse) {
        states.patchState({
            multicity: {
                value: action.response.Results[0],
                traceId: action.response.TraceId
            }
        });
    }

}