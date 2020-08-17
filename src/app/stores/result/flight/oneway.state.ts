import { resultObj, itinerarytrip, emailtrip, fareRule, trips, baggage, AddEmailTrips } from '../flight.state';
import { Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import { FilterState, filter, GetAirlines } from '../filter.state';
import * as moment from 'moment';
import * as _ from 'lodash';
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

}