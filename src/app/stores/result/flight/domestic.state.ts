import { State, Store, StateContext, Action, Selector } from '@ngxs/store';
import { resultObj, emailtrip, itinerarytrip, AddEmailTrips, trips, baggage, fareRule } from '../flight.state';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import { FilterState, filter, GetAirlines } from '../filter.state';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { BaseFlightResult } from './flight-result';

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

    @Selector([FilterState])
    static getDomesticDepartureRoundTrip(states: domesticResult, filterState: filter): resultObj[] {
        return states.departure.value.filter(
            el =>
                (filterState.departure.stops !== -1 ? el.stops == filterState.departure.stops : el) &&
                (filterState.departure.price == 0 ? el : filterState.departure.price <= el.fare) &&
                el.corporate == filterState.departure.corporateFare &&
                moment(el.departure).hour() <= filterState.departure.depatureHours &&
                moment(el.arrival).hour() <= filterState.departure.arrivalHours &&
                (
                    filterState.departure.airlines.some(air => air.value == true) ?
                        filterState.departure.airlines.some(air => (air.name === el.name) && (air.value)) : el
                )
        );
    }

    @Selector([FilterState])
    static getDomesticReturnRoundTrip(states: domesticResult, filterState: filter): resultObj[] {
        return states.return.value.filter(
            el =>
                (filterState.return.stops !== -1 ? el.stops == filterState.return.stops : el) &&
                (filterState.return.price == 0 ? el : filterState.return.price <= el.fare) &&
                el.corporate == filterState.return.corporateFare &&
                moment(el.departure).hour() <= filterState.return.depatureHours &&
                moment(el.arrival).hour() <= filterState.return.arrivalHours &&
                (
                    filterState.return.airlines.some(air => air.value == true) ?
                        filterState.return.airlines.some(air => (air.name === el.name) && (air.value)) : el
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
        states.patchState({
            departure: {
                value: this.responseData(action.response.Results[0], action.response.TraceId),
                traceId: action.response.TraceId,
                selectedFlight:null
            },
            return: {
                value: this.responseData(action.response.Results[1], action.response.TraceId),
                traceId: action.response.TraceId,
                selectedFlight:null
            }
        });

        this.store.dispatch(new AddEmailTrips(this.emailTrips(action.response.Results[0])));
        let newObs = new Observable(
            (Subscriber) => {
                Subscriber.next(this.store.dispatch(new GetAirlines(states.getState().departure.value,'departure')))
                Subscriber.next(this.store.dispatch(new GetAirlines(states.getState().return.value, 'return')))
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
}
