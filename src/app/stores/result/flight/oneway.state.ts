import { resultObj, itinerarytrip, emailtrip, fareRule, trips, baggage, AddEmailTrips } from '../flight.state';
import { Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import { FilterState, filter, GetAirlines } from '../filter.state';
import * as moment from 'moment';
import { BaseFlightResult } from './flight-result';

export interface onewayResult {
    value: resultObj[]
    traceId: string
    selectedFlight: resultObj
}

export class OneWayResponse {
    static readonly type = '[OneWay] OneWayResponse';
    constructor(public response: flightSearchResult) {

    }
}

export class SelectedFlight {
    static readonly type = '[OneWay] SelectedFlight';
    constructor(public currentFlight: resultObj) {

    }
}

export class DurationSort {
    static readonly type = '[OneWay] DurationSort';
    constructor(public state: string) {

    }
}

export class ArrivalSort {
    static readonly type = '[OneWay] ArrivalSort';
    constructor(public state: string) {

    }
}

export class DepartureSort {
    static readonly type = '[OneWay] DepartureSort';
    constructor(public state: string) {

    }
}

export class PriceSort {
    static readonly type = '[OneWay] PriceSort';
    constructor(public state: string) {

    }
}


@State<onewayResult>({
    name: 'oneway_result',
    defaults: {
        value: null,
        traceId: null,
        selectedFlight: null
    }
})

export class OneWayResultState extends BaseFlightResult {

    constructor(
        private store : Store
    ) {

        super();
    }

    @Selector([FilterState])
    static getOneWay(states: onewayResult, filterState: filter): resultObj[] {

        return states.value.filter(
            el =>
                (filterState.stops !== -1 ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.some(air => (air.name === el.name) && (air.value))
        );
    }

    @Selector()
    static getSelectedFlight(states: onewayResult) : resultObj {
        return states.selectedFlight;
    }

    @Action(SelectedFlight)
    selectedFlight(states: StateContext<onewayResult>, action: SelectedFlight) {
        states.patchState({
            selectedFlight: action.currentFlight
        });
    }

    @Action(OneWayResponse)
    onewayResponse(states: StateContext<onewayResult>, action: OneWayResponse) {
        states.patchState({
            value: this.responseData(action.response.Results[0], action.response.TraceId),
            traceId: action.response.TraceId
        });
        this.store.dispatch(new AddEmailTrips(this.emailTrips(action.response.Results[0])));
        this.store.dispatch(new GetAirlines(states.getState().value));
    }

    @Action(DurationSort)
    durationSort(states: StateContext<onewayResult>, action: DurationSort) {
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
    arrivalSort(states: StateContext<onewayResult>, action: ArrivalSort) {
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
    departureSort(states: StateContext<onewayResult>, action: DepartureSort) {
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
    priceSort(states: StateContext<onewayResult>, action: PriceSort) {
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