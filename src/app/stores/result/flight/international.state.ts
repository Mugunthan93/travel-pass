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

export class DurationSort {
    static readonly type = '[International] DurationSort';
    constructor(public state: string) {

    }
}

export class ArrivalSort {
    static readonly type = '[International] ArrivalSort';
    constructor(public state: string) {

    }
}

export class DepartureSort {
    static readonly type = '[International] DepartureSort';
    constructor(public state: string) {

    }
}

export class PriceSort {
    static readonly type = '[International] PriceSort';
    constructor(public state: string) {

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
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes(el.name)
        );
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

    @Action(DurationSort)
    durationSort(states: StateContext<internationalResult>, action: DurationSort) {
        if (action.state == 'default') {
            states.patchState({
                value: this.ascDuration(states.getState().value)
            });
        }
        else if (action.state == 'rotated') {
            states.patchState({
                value: this.desDuration(states.getState().value)
            });
        }
    }

    @Action(ArrivalSort)
    arrivalSort(states: StateContext<internationalResult>, action: ArrivalSort) {
        if (action.state == 'default') {
            states.patchState({
                value: this.ascArrival(states.getState().value)
            });
        }
        else if (action.state == 'rotated') {
            states.patchState({
                value: this.desArrival(states.getState().value)
            });
        }
    }

    @Action(DepartureSort)
    departureSort(states: StateContext<internationalResult>, action: DepartureSort) {
        if (action.state == 'default') {
            states.patchState({
                value: this.ascDeparture(states.getState().value)
            });
        }
        else if (action.state == 'rotated') {
            states.patchState({
                value: this.desDeparture(states.getState().value)
            });
        }
    }

    @Action(PriceSort)
    priceSort(states: StateContext<internationalResult>, action: PriceSort) {
        if (action.state == 'default') {
            states.patchState({
                value: this.ascPrice(states.getState().value)
            });
        }
        else if (action.state == 'rotated') {
            states.patchState({
                value: this.desPrice(states.getState().value)
            });
        }
    }
}