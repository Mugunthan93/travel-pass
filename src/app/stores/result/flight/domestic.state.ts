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

export class DurationSort {
    static readonly type = '[Domestic] DurationSort';
    constructor(public state: string) {

    }
}

export class ArrivalSort {
    static readonly type = '[Domestic] ArrivalSort';
    constructor(public state: string) {

    }
}

export class DepartureSort {
    static readonly type = '[Domestic] DepartureSort';
    constructor(public state: string) {

    }
}

export class PriceSort {
    static readonly type = '[Domestic] PriceSort';
    constructor(public state: string) {

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
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes({ name: el.name, value: true })
        );
    }

    @Selector([FilterState])
    static getDomesticReturnRoundTrip(states: domesticResult, filterState: filter): resultObj[] {
        return states.return.value.filter(
            el =>
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes({ name: el.name, value: true })
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
                Subscriber.next(this.store.dispatch(new GetAirlines(states.getState().departure.value)))
                Subscriber.next(this.store.dispatch(new GetAirlines(states.getState().return.value)))
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


    @Action(DurationSort)
    durationSort(states: StateContext<domesticResult>, action: DurationSort) {
        if (action.state == 'default') {
            states.patchState({
                departure: {
                    value: this.ascDuration(states.getState().departure.value)
                },
                return: {
                    value: this.ascDuration(states.getState().return.value)
                }
            });
        }
        else if (action.state == 'rotated') {
            states.patchState({
                departure: {
                    value: this.desDuration(states.getState().departure.value)
                },
                return: {
                    value: this.desDuration(states.getState().return.value)
                }
            });
        }
    }

    @Action(ArrivalSort)
    arrivalSort(states: StateContext<domesticResult>, action: ArrivalSort) {
        // if (action.state == 'default') {
        //     states.patchState({
        //         departure: {
        //             value: this.ascArrival(states.getState().departure.value)
        //         },
        //         return: {
        //             value: this.ascArrival(states.getState().return.value)
        //         }
        //     });
        // }
        // else if (action.state == 'rotated') {
        //     states.patchState({
        //         departure: {
        //             value: this.desArrival(states.getState().departure.value)
        //         },
        //         return: {
        //             value: this.desArrival(states.getState().return.value)
        //         }
        //     });
        // }
    }

    @Action(DepartureSort)
    departureSort(states: StateContext<domesticResult>, action: DepartureSort) {
        if (action.state == 'default') {
            states.patchState({
                departure: {
                    value: this.ascDeparture(states.getState().departure.value)
                },
                return: {
                    value: this.ascDeparture(states.getState().return.value)
                }
            });
        }
        else if (action.state == 'rotated') {
            states.patchState({
                departure: {
                    value: this.desDeparture(states.getState().departure.value)
                },
                return: {
                    value: this.desDeparture(states.getState().return.value)
                }
            });
        }
    }

    @Action(PriceSort)
    priceSort(states: StateContext<domesticResult>, action: PriceSort) {
        if (action.state == 'default') {
            states.patchState({
                departure: {
                    value: this.ascPrice(states.getState().departure.value)
                },
                return: {
                    value: this.ascPrice(states.getState().return.value)
                }
            });
        }
        else if (action.state == 'rotated') {
            states.patchState({
                departure: {
                    value: this.desPrice(states.getState().departure.value)
                },
                return: {
                    value: this.desPrice(states.getState().return.value)
                }
            });
        }
    }
}
