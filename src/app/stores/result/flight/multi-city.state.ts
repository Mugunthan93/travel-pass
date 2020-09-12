import { resultObj, AddEmailTrips } from '../flight.state';
import { Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { flightSearchResult } from 'src/app/models/search/flight';
import * as moment from 'moment';
import { BaseFlightResult } from './flight-result';
import { FlightFilterState, flightFilter, GetAirlines } from '../filter/flight.filter.state';

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

    @Selector([FlightFilterState])
    static getMultiWay(states: multicityResult, filterState: flightFilter): resultObj[] {
        return states.value.filter(
            el =>
                (filterState.stops !== -1 ? el.stops == filterState.stops : el) &&
                (filterState.price == 0 ? el : filterState.price <= el.fare) &&
                el.corporate == filterState.corporateFare &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                (
                    filterState.airlines.some(air => air.value == true) ?
                        filterState.airlines.some(air => (air.name === el.name) && (air.value)) : el
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