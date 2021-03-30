import { resultObj, AddEmailTrips } from '../flight.state';
import { Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { flightSearchResult } from 'src/app/models/search/flight';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BaseFlightResult } from './flight-result';
import { FlightFilterState, flightFilter, GetAirlines } from '../filter/flight.filter.state';
import { CompanyState } from '../../company.state';
import { FlightSearchState } from '../../search/flight.state';
import { MultiCitySearchState } from '../../search/flight/multi-city.state';
import { OneWaySearchState } from '../../search/flight/oneway.state';
import { RoundTripSearchState } from '../../search/flight/round-trip.state';
import { Injectable } from '@angular/core';

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

@Injectable()
export class OneWayResultState extends BaseFlightResult {

    constructor(
        public store : Store
    ) {
        super();
    }

    @Selector([FlightFilterState])
    static getOneWay(states: onewayResult, filterState: flightFilter): resultObj[] {

        return states.value.filter(
            el =>
                (filterState.stops !== -1 ? el.stops == filterState.stops : el) &&
                (filterState.price == 0 ? el : filterState.price >= el.fare) &&
                (filterState.corporateFare == false ? el : el.corporate == filterState.corporateFare) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                (
                    filterState.airlines.some(air => air.value == true) ?
                        filterState.airlines.some(air => (air.name === el.name) && (air.value)) : el
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

        let result : resultObj[] =  this.responseData(action.response.Results[0], action.response.TraceId);
        console.log(this.getmarkup());
        result.forEach(
            (el) => {
                if(this.getmarkup() !== 0) {
                    el.fare = el.fare + ((el.fare / 100) * this.getmarkup());
                    el.email.fare = el.email.fare + ((el.email.fare / 100) * this.getmarkup());

                    el.trips.forEach(
                        (e) => {
                            e.tripinfo.fare = e.tripinfo.fare + ((e.tripinfo.fare / 100) * this.getmarkup());
                        }
                    );
                }
            }
        );

        states.patchState({
            value: result,
            traceId: action.response.TraceId
        });
        this.store.dispatch(new AddEmailTrips(this.emailTrips(action.response.Results[0])));
        this.store.dispatch(new GetAirlines(states.getState().value));
    }

    getmarkup() : number {
        let journeyType : number = this.store.selectSnapshot(FlightSearchState.getJourneyType);
        let type : string = null;

        if(journeyType == 1) {
            type = this.store.selectSnapshot(OneWaySearchState.getTripType);
        }
        else if(journeyType == 2) {
            type = this.store.selectSnapshot(RoundTripSearchState.getTripType);
        }
        else if(journeyType == 3) {
            type = this.store.selectSnapshot(MultiCitySearchState.getTripType);
        }

        if(type == 'domestic') {
            return this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);
        }
        else if(type == 'international') {
            return this.store.selectSnapshot(CompanyState.getInternationalMarkupCharge);
        }
    }

}
