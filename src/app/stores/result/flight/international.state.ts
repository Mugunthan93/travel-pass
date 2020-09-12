import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { resultObj, AddEmailTrips } from '../flight.state';
import { flightSearchResult } from 'src/app/models/search/flight';
import { Navigate } from '@ngxs/router-plugin';
import * as moment from 'moment';
import { BaseFlightResult } from './flight-result';
import { FlightFilterState, flightFilter, GetAirlines } from '../filter/flight.filter.state';

export interface internationalResult {
    value: resultObj[]
    traceId: string
    selectedFlight: resultObj
}

export class InternationalResponse {
    static readonly type = '[International] InternationalResponse';
    constructor(public response: flightSearchResult) {

    }
}

export class SelectedFlight {
    static readonly type = '[International] SelectedFlight';
    constructor(public currentFlight: resultObj) {

    }
}

@State<internationalResult>({
    name: 'international_result',
    defaults: {
        value: null,
        traceId: null,
        selectedFlight: null
    }
})

export class InternationalResultState extends BaseFlightResult {

    constructor(
        public store: Store
    ) {
        super();
    }

    @Selector([FlightFilterState])
    static getInternationalRoundTrip(states: internationalResult, filterState: flightFilter): resultObj[] {
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
    static getSelectedFlight(states: internationalResult) {
        return states.selectedFlight;
    }

    @Action(SelectedFlight)
    selectedFlight(states: StateContext<internationalResult>, action: SelectedFlight) {
        states.patchState({
            selectedFlight: action.currentFlight
        });
    }

    @Action(InternationalResponse)
    internationalResponse(states: StateContext<internationalResult>, action: InternationalResponse) {
        states.patchState({
            value: this.responseData(action.response.Results[0], action.response.TraceId),
            traceId: action.response.TraceId
        });

        this.store.dispatch(new AddEmailTrips(this.emailTrips(action.response.Results[0])));
        this.store.dispatch(new GetAirlines(states.getState().value));
        this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'round-trip', 'international']));
    }
}