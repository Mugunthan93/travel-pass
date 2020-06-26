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

export class DurationSort {
    static readonly type = '[MultiCity] DurationSort';
    constructor(public state: string) {

    }
}

export class ArrivalSort {
    static readonly type = '[MultiCity] ArrivalSort';
    constructor(public state: string) {

    }
}

export class DepartureSort {
    static readonly type = '[MultiCity] DepartureSort';
    constructor(public state: string) {

    }
}

export class PriceSort {
    static readonly type = '[MultiCity] PriceSort';
    constructor(public state: string) {

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
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes(el.name)
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


    @Action(DurationSort)
    durationSort(states: StateContext<multicityResult>, action: DurationSort) {
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
    arrivalSort(states: StateContext<multicityResult>, action: ArrivalSort) {
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
    departureSort(states: StateContext<multicityResult>, action: DepartureSort) {
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
    priceSort(states: StateContext<multicityResult>, action: PriceSort) {
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