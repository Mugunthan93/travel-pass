import { resultObj, emailtrip, itinerarytrip, AddEmailTrips, fareRule, trips, baggage } from '../flight.state';
import { Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { FlightService } from 'src/app/services/flight/flight.service';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import { GetAirlines, FilterState, filter } from '../filter.state';
import * as moment from 'moment';
import { BaseFlightResult } from './flight-result';

export interface multicityResult {
    value: resultObj[]
    traceId: string
    selectedFlight: resultObj
    
}


export class MultiCityResponse {
    static readonly type = '[MultiCity] MultiCityResponse';
    constructor(public response: flightSearchResult) {

    }
}

export class SelectedFlight {
    static readonly type = '[MultiCity] SelectedFlight';
    constructor(public currentFlight: resultObj) {

    }
}

@State<multicityResult>({
    name: 'multicity_result',
    defaults: {
        value: null,
        traceId: null,
        selectedFlight: null
    }
})
    
export class MultiCityResultState extends BaseFlightResult {

    constructor(
        public store: Store
    ) {
        super();
    }

    @Selector([FilterState])
    static getMultiWay(states: multicityResult, filterState: filter): resultObj[] {
        return states.value.filter(
            el =>
                (filterState.flight.stops !== -1 ? el.stops == filterState.flight.stops : el) &&
                el.corporate == filterState.flight.corporateFare &&
                moment(el.departure).hour() <= filterState.flight.depatureHours &&
                moment(el.arrival).hour() <= filterState.flight.arrivalHours &&
                (
                    filterState.flight.airlines.some(air => air.value == true) ?
                        filterState.flight.airlines.some(air => (air.name === el.name) && (air.value)) : el
                )
        );
    }

    @Selector()
    static getSelectedFlight(states: multicityResult) {
        return states.selectedFlight;
    }

    @Action(SelectedFlight)
    selectedFlight(states: StateContext<multicityResult>, action: SelectedFlight) {
        states.patchState({
            selectedFlight: action.currentFlight
        });
    }

    @Action(MultiCityResponse)
    multicityResponse(states: StateContext<multicityResult>, action: MultiCityResponse) {
        states.patchState({
            value: this.responseData(action.response.Results[0], action.response.TraceId),
            traceId: action.response.TraceId
        });

        this.store.dispatch(new AddEmailTrips(this.emailTrips(action.response.Results[0])));
        this.store.dispatch(new GetAirlines(states.getState().value));
    }

}