import { State, Store, StateContext, Action, Selector } from '@ngxs/store';
import { resultObj, AddEmailTrips } from '../flight.state';
import { flightSearchResult } from 'src/app/models/search/flight';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { BaseFlightResult } from './flight-result';
import { DepartureFilterState, departureFilter, GetDepartureAirlines } from '../filter/departure.filter.state';
import { ReturnFilterState, returnFilter, GetReturnAirlines } from '../filter/return.filter.state';
import { CompanyState } from '../../company.state';
import { FlightSearchState } from '../../search/flight.state';
import { MultiCitySearchState } from '../../search/flight/multi-city.state';
import { OneWaySearchState } from '../../search/flight/oneway.state';
import { RoundTripSearchState } from '../../search/flight/round-trip.state';

export interface domesticResult {
    departure: {
        value?: resultObj[]
        traceId?: string
        selectedFlight?: resultObj
    },
    return: {
        value?: resultObj[]
        traceId?: string
        selectedFlight?: resultObj
    }
}

export class DomesticResponse {
    static readonly type = '[Domestic] DomesticResponse';
    constructor(public response: flightSearchResult) {

    }
}

export class SelectedDepartureFlight {
    static readonly type = '[Domestic] SelectedDepartureFlight';
    constructor(public currentFlight: resultObj) {

    }
}

export class SelectedReturnFlight {
    static readonly type = '[Domestic] SelectedReturnFlight';
    constructor(public currentFlight: resultObj) {

    }
}

@State<domesticResult>({
    name: 'domestic_result',
    defaults: {
        departure: {
            value: null,
            traceId: null,
            selectedFlight: null
        },
        return: {
            value: null,
            traceId: null,
            selectedFlight: null
        }
    }
})

export class DomesticResultState extends BaseFlightResult {

    constructor(
        public store: Store
    ) {
        super();
    }

    @Selector([DepartureFilterState])
    static getDomesticDepartureRoundTrip(states: domesticResult, filterState: departureFilter): resultObj[] {
        return states.departure.value.filter(
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

    @Selector([ReturnFilterState])
    static getDomesticReturnRoundTrip(states: domesticResult, filterState: returnFilter): resultObj[] {
        return states.return.value.filter(
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
    static getSelectedDepartureFlight(states: domesticResult): resultObj {
        return states.departure.selectedFlight;
    }

    @Selector()
    static getSelectedReturnFlight(states: domesticResult): resultObj {
        return states.return.selectedFlight;
    }

    @Action(SelectedDepartureFlight)
    selectedDepartureFlight(states: StateContext<domesticResult>, action: SelectedDepartureFlight) {

        let currentState = states.getState();

        states.patchState({
            departure: {
                value: currentState.departure.value,
                traceId: currentState.departure.traceId,
                selectedFlight: action.currentFlight
            }
        });
    }

    @Action(SelectedReturnFlight)
    selectedReturnFlight(states: StateContext<domesticResult>, action: SelectedReturnFlight) {

        let currentState = states.getState();

        states.patchState({
            return: {
                value: currentState.return.value,
                traceId: currentState.return.traceId,
                selectedFlight: action.currentFlight
            }
        });
    }

    @Action(DomesticResponse)
    domesticResponse(states: StateContext<domesticResult>, action: DomesticResponse) {

        let result1 : resultObj[] =  this.responseData(action.response.Results[0], action.response.TraceId);
        let result2 : resultObj[] =  this.responseData(action.response.Results[1], action.response.TraceId);
        console.log(this.getmarkup());
        result1.forEach(
            (el,ind,arr) => {
                if(this.getmarkup() !== 0) {
                    el.fare = el.fare + ((el.fare / 100) * this.getmarkup());
                    el.email.fare = el.email.fare + ((el.email.fare / 100) * this.getmarkup());
    
                    el.trips.forEach(
                        (e,i,a) => {
                            e.tripinfo.fare = e.tripinfo.fare + ((e.tripinfo.fare / 100) * this.getmarkup());
                        }
                    );
                }
            }
        );
        result2.forEach(
            (el,ind,arr) => {
                if(this.getmarkup() !== 0) {
                    el.fare = el.fare + ((el.fare / 100) * this.getmarkup());
                    el.email.fare = el.email.fare + ((el.email.fare / 100) * this.getmarkup());
    
                    el.trips.forEach(
                        (e,i,a) => {
                            e.tripinfo.fare = e.tripinfo.fare + ((e.tripinfo.fare / 100) * this.getmarkup());
                        }
                    );
                }
            }
        );

        states.patchState({
            departure: {
                value: result1,
                traceId: action.response.TraceId,
                selectedFlight:null
            },
            return: {
                value: result2,
                traceId: action.response.TraceId,
                selectedFlight:null
            }
        });

        this.store.dispatch(new AddEmailTrips(this.emailTrips(action.response.Results[0])));
        let newObs = new Observable(
            (Subscriber) => {
                Subscriber.next(this.store.dispatch(new GetDepartureAirlines(states.getState().departure.value,'departure')))
                Subscriber.next(this.store.dispatch(new GetReturnAirlines(states.getState().return.value, 'return')))
                Subscriber.complete();
            }
        );

        newObs.subscribe({
            next: (res: Observable<any>) => {
                res.subscribe(res => console.log(res));
            },
            complete: () => {
                this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'round-trip', 'domestic']));
            }
        })

            // this.store.dispatch(new GetAirlines(states.getState().departure.value));
            // this.store.dispatch(new GetAirlines(states.getState().return.value));
            // this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'round-trip','domestic']));
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
