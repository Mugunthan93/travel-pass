import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import * as moment from "moment";
import * as _ from "lodash";
import { Navigate } from '@ngxs/router-plugin';

export interface flight{
    oneway: onewayResult
    roundtrip: roundtripResult
    multicity: multicityResult
    filterInputs:filterInput
}

export interface onewayResult{
    value: resultObj[]
    traceId: string
}

export interface roundtripResult {
    value?: resultObj[]
    values?: rountripValue
    traceId: string
}

export interface rountripValue{
    departure: resultObj[],
    return: resultObj[]
}

export interface multicityResult {
    value: resultObj[]
    traceId: string
}

export interface resultObj {
    fare: number
    name: string
    currency: string
    trips: trips[]
    seats: number
    Duration: number
    departure: string
    arrival: string
    baggage: flightData[][],
    connectingFlights: flightData[][],
    fareRule: fareRule,
    stops: number
}

export interface trips {
    tripinfo: flightDetail
}

export interface flightDetail {
    logo: string,
    airline: {
        name: string,
        code: string,
        number: string
    },
    depTime: string,
    arrTime: string,
    class: string,
    duration: string,
    stops: string,
    seats: number,
    fare: number,
    currency: string
}

export interface fareRule {
    ResultIndex: string
    TraceId: string
}

export interface filterInput{
    stops: number
    depatureHours: number
    arrivalHours: number
    corporateFare:boolean
    airlines : string[]
}

export class OneWayResponse{
    static readonly type = '[FlightResult] OneWayResponse';
    constructor(public response: flightSearchResult) {
        
    }
}

export class RoundTripResponse {
    static readonly type = '[FlightResult] RoundTripResponse';
    constructor(public response: flightSearchResult) {

    }
}

export class MultiCityResponse {
    static readonly type = '[FlightResult] MultiCityResponse';
    constructor(public response: flightSearchResult) {

    }
}

export class DurationSort {
    static readonly type = '[FlightResult] DurationSort';
    constructor(public type: string,public order:string) {

    }
}

export class ArrivalSort {
    static readonly type = '[FlightResult] ArrivalSort';
    constructor(public type: string, public order: string) {

    }
}

export class DepartureSort {
    static readonly type = '[FlightResult] DepartureSort';
    constructor(public type: string, public order: string) {

    }
}

export class PriceSort {
    static readonly type = '[FlightResult] PriceSort';
    constructor(public type: string, public order: string) {

    }
}

@State<flight>({
    name: 'FlightResult',
    defaults: {
        oneway: null,
        roundtrip: null,
        multicity: null,
        filterInputs: {
            stops: null,
            depatureHours: 24,
            arrivalHours: 24,
            corporateFare: false,
            airlines:[]
        }
    }
})

export class FlightResultState{

    constructor(
        private store : Store
    ) {

    }

    @Selector() 
    static getOneWay(states: flight): resultObj[]{
        console.log(states.oneway.value, states.filterInputs);
        return states.oneway.value.filter(
            el =>
                (states.filterInputs.stops !== null ? el.stops == states.filterInputs.stops : el) &&
                moment(el.departure).hour() <= states.filterInputs.depatureHours &&
                moment(el.arrival).hour() <= states.filterInputs.arrivalHours &&
                states.filterInputs.airlines.includes(el.name)
            );
    }

    @Selector()
    static getRoundTrip(states: flight): roundtripResult {
        return states.roundtrip;
    }

    @Selector()
    static getMultiWay(states: flight): resultObj[] {
        return states.multicity.value;
    }

    @Selector()
    static getFilter(states: flight) {
        return states.filterInputs;
    }

    @Action(DurationSort)
    durationSort(states: StateContext<flight>, action: DurationSort) {
        if (action.type == 'one-way') {
            const traceId: string = states.getState().oneway.traceId;
            const currentState: resultObj[] = states.getState().oneway.value;
            
            states.patchState({
                oneway: {
                    value: this.sortByDuration(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentState: resultObj[] = states.getState().roundtrip.value;

            states.patchState({
                roundtrip: {
                    value: this.sortByDuration(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'animated-round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentDepState: resultObj[] = states.getState().roundtrip.values.departure;
            const currentReState: resultObj[] = states.getState().roundtrip.values.return;

            states.patchState({
                roundtrip: {
                    values: {
                        departure: this.sortByDuration(action, currentDepState),
                        return: this.sortByDuration(action, currentReState)
                    },
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'multi-city') {
            const traceId: string = states.getState().multicity.traceId;
            const currentState: resultObj[] = states.getState().multicity.value;

            states.patchState({
                multicity: {
                    value: this.sortByDuration(action, currentState),
                    traceId: traceId
                }
            });
        }
    }

    @Action(ArrivalSort)
    arrivalSort(states: StateContext<flight>, action: ArrivalSort) {
        if (action.type == 'one-way') {
            const traceId: string = states.getState().oneway.traceId;
            const currentState: resultObj[] = states.getState().oneway.value;

            states.patchState({
                oneway: {
                    value: this.sortbyArrival(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentState: resultObj[] = states.getState().roundtrip.value;

            states.patchState({
                roundtrip: {
                    value: this.sortbyArrival(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'animated-round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentDepState: resultObj[] = states.getState().roundtrip.values.departure;
            const currentReState: resultObj[] = states.getState().roundtrip.values.return;

            states.patchState({
                roundtrip: {
                    values: {
                        departure: this.sortbyArrival(action, currentDepState),
                        return: this.sortbyArrival(action, currentReState)
                    },
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'multi-city') {
            const traceId: string = states.getState().multicity.traceId;
            const currentState: resultObj[] = states.getState().multicity.value;

            states.patchState({
                multicity: {
                    value: this.sortbyArrival(action, currentState),
                    traceId: traceId
                }
            });
        }
    }

    @Action(DepartureSort)
    departureSort(states: StateContext<flight>, action: DepartureSort) {
        if (action.type == 'one-way') {
            const traceId: string = states.getState().oneway.traceId;
            const currentState: resultObj[] = states.getState().oneway.value;

            states.patchState({
                oneway: {
                    value: this.sortByDeparture(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentState: resultObj[] = states.getState().roundtrip.value;

            states.patchState({
                roundtrip: {
                    value: this.sortByDeparture(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'animated-round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentDepState: resultObj[] = states.getState().roundtrip.values.departure;
            const currentReState: resultObj[] = states.getState().roundtrip.values.return;

            states.patchState({
                roundtrip: {
                    values: {
                        departure: this.sortByDeparture(action, currentDepState),
                        return: this.sortByDeparture(action, currentReState)
                    },
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'multi-city') {
            const traceId: string = states.getState().multicity.traceId;
            const currentState: resultObj[] = states.getState().multicity.value;

            states.patchState({
                multicity: {
                    value: this.sortByDeparture(action, currentState),
                    traceId: traceId
                }
            });
        }
    }

    @Action(PriceSort)
    priceSort(states: StateContext<flight>, action: PriceSort) {
        if (action.type == 'one-way') {
            const traceId: string = states.getState().oneway.traceId;
            const currentState: resultObj[] = states.getState().oneway.value;

            states.patchState({
                oneway: {
                    value: this.sortbyPrice(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentState: resultObj[] = states.getState().roundtrip.value;

            states.patchState({
                roundtrip: {
                    value: this.sortbyPrice(action, currentState),
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'animated-round-trip') {
            const traceId: string = states.getState().roundtrip.traceId;
            const currentDepState: resultObj[] = states.getState().roundtrip.values.departure;
            const currentReState: resultObj[] = states.getState().roundtrip.values.return;

            states.patchState({
                roundtrip: {
                    values: {
                        departure: this.sortbyPrice(action, currentDepState),
                        return: this.sortbyPrice(action, currentReState)
                    },
                    traceId: traceId
                }
            });
        }
        else if (action.type == 'multi-city') {
            const traceId: string = states.getState().multicity.traceId;
            const currentState: resultObj[] = states.getState().multicity.value;

            states.patchState({
                multicity: {
                    value: this.sortbyPrice(action, currentState),
                    traceId: traceId
                }
            });
        }
    }

    @Action(OneWayResponse)
    onewayResponse(states: StateContext<flight>, action: OneWayResponse) {
        states.patchState({
            oneway: {
                value: this.responseDate(action.response.Results[0], action.response.TraceId),
                traceId: action.response.TraceId
            }
        });

        const currentState = states.getState().oneway.value;
        let airlines: string[] = [];
        currentState.forEach(
            (el) => {
                airlines.push(el.name);
            }
        );

        states.patchState({
            filterInputs: {
                stops: null,
                depatureHours: 24,
                arrivalHours: 24,
                corporateFare: false,
                airlines: _.sortedUniq(airlines)
            }
        })
    }

    @Action(RoundTripResponse)
    roundtripResponse(states: StateContext<flight>, action: RoundTripResponse) {
        if (action.response.Results.length == 1) {
            states.patchState({
                roundtrip: {
                    value: this.responseDate(action.response.Results[0], action.response.TraceId),
                    values: {
                        departure: null,
                        return: null
                    },
                    traceId: action.response.TraceId
                }
            });

            const currentState = states.getState().roundtrip.value;
            let airlines: string[] = [];
            currentState.forEach(
                (el) => {
                    airlines.push(el.name);
                }
            );

            states.patchState({
                filterInputs: {
                    stops: null,
                    depatureHours: 24,
                    arrivalHours: 24,
                    corporateFare: false,
                    airlines: _.sortedUniq(airlines)
                }
            })

            this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'round-trip','international']));

        }
        else if (action.response.Results.length == 2) {
            states.patchState({
                roundtrip: {
                    value:null,
                    values: {
                        departure: this.responseDate(action.response.Results[0], action.response.TraceId),
                        return: this.responseDate(action.response.Results[1], action.response.TraceId)
                    },
                    traceId: action.response.TraceId
                }
            });

            const currentDepState = states.getState().roundtrip.values.departure;
            const currentReState = states.getState().roundtrip.values.return;
            let Depairlines: string[] = [];
            let Reairlines: string[] = [];
            currentDepState.forEach(
                (el) => {
                    Depairlines.push(el.name);
                }
            );
            currentReState.forEach(
                (el) => {
                    Reairlines.push(el.name);
                }
            );
            
            states.patchState({
                filterInputs: {
                    stops: null,
                    depatureHours: 24,
                    arrivalHours: 24,
                    corporateFare: false,
                    airlines: _.sortedUniq(_.union(Depairlines, Reairlines))
                }
            })

            this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'round-trip','domestic']));

        }
    }

    @Action(MultiCityResponse)
    multicityResponse(states: StateContext<flight>, action: MultiCityResponse) {
        states.patchState({
            multicity: {
                value: this.responseDate(action.response.Results[0], action.response.TraceId),
                traceId: action.response.TraceId
            }
        });

        const currentState = states.getState().multicity.value;
        let airlines: string[] = [];
        currentState.forEach(
            (el) => {
                airlines.push(el.name);
            }
        );
        states.patchState({
            filterInputs: {
                stops: null,
                depatureHours: 24,
                arrivalHours: 24,
                corporateFare: false,
                airlines: _.sortedUniq(airlines)
            }
        })
    }

    responseDate(response: flightResult[],traceId : string): resultObj[] {

        let resultObj: resultObj[] = new Array(response.length);

        response.forEach(
            (element: flightResult, index, array) => {

                let trips: trips[] = new Array(element.Segments.length);
                let totalDuration: number = 0;
                let lastArrival: string;
                let stops: number = 0;

                element.Segments.forEach(
                    (el, ind, arr) => {


                        lastArrival = el[el.length - 1].Destination.ArrTime;
                        totalDuration += this.getDuration(el);
                        stops = stops < el.length ? el.length : stops;

                        trips[ind] = {
                            tripinfo: {
                                logo: el[0].Airline.AirlineCode,
                                airline: {
                                    name: el[0].Airline.AirlineName,
                                    code: el[0].Airline.AirlineCode,
                                    number: el[0].Airline.FlightNumber
                                },
                                depTime: el[0].Origin.DepTime,
                                arrTime: el[el.length - 1].Destination.ArrTime,
                                class: this.getCabinClass(el[0].CabinClass),
                                duration: moment.duration(this.getDuration(el), 'minutes').days() + "d " + moment.duration(this.getDuration(el), 'minutes').hours() + "h " + moment.duration(this.getDuration(el), 'minutes').minutes() + "m",
                                stops: el.length == 1 ? 'Non Stop' : el.length - 1 + " Stop",
                                seats: el[0].NoOfSeatAvailable,
                                fare: element.Fare.PublishedFare,
                                currency: element.Fare.Currency
                            }
                        }
                    });
                
                let fareRule: fareRule = {
                    ResultIndex: element.ResultIndex,
                    TraceId: traceId
                }

                resultObj[index] = {
                    name: element.Segments[0][0].Airline.AirlineName,
                    fare: element.Fare.PublishedFare,//price
                    Duration: totalDuration,
                    departure: element.Segments[0][0].Origin.DepTime,
                    arrival: lastArrival,
                    currency: element.Fare.Currency,
                    seats: element.Segments[0][0].NoOfSeatAvailable,
                    trips: trips,
                    baggage: element.Segments,
                    connectingFlights: element.Segments,
                    fareRule: fareRule,
                    stops: stops
                };

            }
        );

        return resultObj;
    }

    getCabinClass(cls: string) {
        if (cls == "1" || "2") {
            return "economy"
        }
        else if (cls == "3") {
            return "premium economy";
        }
        else if (cls == "4") {
            return "bussiness";
        }
        else if (cls == "5") {
            return "first class";
        }
    }

    getDuration(data: flightData[]): number {
        let time: number = 0;
        data.forEach(
            (e, i, a) => {
                time += (e.GroundTime + e.Duration);
            }
        );
        return time;
    }

    sortByDuration(action: DurationSort, currentState: resultObj[]): resultObj[] {
        if (action.order == 'default') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (b.Duration < a.Duration) {
                        return -1;
                    }
                    else if (b.Duration > a.Duration) {
                        return 1;
                    }
                    return 0;
                }
            );
            return state;
        }
        else if (action.order == 'rotated') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (b.Duration > a.Duration) {
                        return -1;
                    }
                    else if (b.Duration < a.Duration) {
                        return 1;
                    }
                    return 0;
                }
            );
            return state;
        }

    }

    sortByDeparture(action: ArrivalSort, currentState: resultObj[]): resultObj[] {  
        if (action.order == 'default') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (moment(b.departure).isBefore(a.departure)) {
                        return -1;
                    }
                    else if (moment(b.departure).isAfter(a.departure)) {
                        return 1;
                    }
                    else if (moment(b.departure).isSame(a.departure)) {
                        return 0;
                    }
                }
            );
            return state;
        }
        else if (action.order == 'rotated') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (moment(b.departure).isAfter(a.departure)) {
                        return -1;
                    }
                    else if (moment(b.departure).isBefore(a.departure)) {
                        return 1;
                    }
                    else if (moment(b.departure).isSame(a.departure)) {
                        return 0;
                    }
                }
            );
            return state;
        }
    }

    sortbyArrival(action: ArrivalSort, currentState: resultObj[]): resultObj[] {
        if (action.order == 'default') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (moment(b.arrival).isBefore(a.arrival)) {
                        return -1;
                    }
                    else if (moment(b.arrival).isAfter(a.arrival)) {
                        return 1;
                    }
                    else if (moment(b.arrival).isSame(a.arrival)) {
                        return 0;
                    }
                }
            );
            return state;
        }
        else if (action.order == 'rotated') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (moment(b.arrival).isAfter(a.arrival)) {
                        return -1;
                    }
                    else if (moment(b.arrival).isBefore(a.arrival)) {
                        return 1;
                    }
                    else if (moment(b.arrival).isSame(a.arrival)) {
                        return 0;
                    }
                }
            );
            return state;
        }
    }

    sortbyPrice(action: PriceSort, currentState: resultObj[]): resultObj[]{
        if (action.order == 'default') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (b.fare < a.fare) {
                        return -1;
                    }
                    else if (b.fare > a.fare) {
                        return 1;
                    }
                    return 0;
                }
            );
            return state;
        }
        else if (action.order == 'rotated') {
            let state: resultObj[] = currentState.slice().sort(
                (a: resultObj, b: resultObj) => {
                    if (b.fare > a.fare) {
                        return -1;
                    }
                    else if (b.fare < a.fare) {
                        return 1;
                    }
                    return 0;
                }
            );
            return state;
        }
    }

}