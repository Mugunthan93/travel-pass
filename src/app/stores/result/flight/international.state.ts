import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { FlightResultState, emailtrip, resultObj, itinerarytrip, AddEmailTrips, fareRule, trips, baggage } from '../flight.state';
import { FlightService } from 'src/app/services/flight/flight.service';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import { GetAirlines, FilterState, filter } from '../filter.state';
import { Navigate } from '@ngxs/router-plugin';
import * as moment from 'moment';
import { BaseFlightResult } from './flight-result';

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

    @Selector([FilterState])
    static getInternationalRoundTrip(states: internationalResult, filterState: filter): resultObj[] {
        return states.value.filter(
            el =>
                (filterState.stops !== -1 ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.some(air => (air.name === el.name) && (air.value))
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