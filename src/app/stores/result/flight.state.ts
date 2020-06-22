import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import * as moment from "moment";
import * as _ from "lodash";
import { Navigate } from '@ngxs/router-plugin';
import { FilterState, filter, GetAirlines } from './filter.state';
import { state } from '@angular/animations';

export interface flight{
    oneway: onewayResult
    roundtrip: roundtripResult
    multicity: multicityResult
    emailtrip :emailtrip
    emailItinerary: itinerarytrip[]
    selectedFlight: resultObj
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
    baggage: baggage[][],
    connectingFlights: flightData[][],
    fareRule: fareRule,
    stops: number,
    email: itinerarytrip
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

export interface baggage {
    originName: string,
    destinationName: string,
    baggage:string,
    cabinBaggage: string,
    
}

export interface emailtrip {
    departure: {
        name: string,
        code: string
    },
    arrival: {
        name: string,
        code: string
    }
}

export interface itinerarytrip {
    class: string,
    refundable: string,
    fare: number
    flights: itineraryFlight[]
}

export interface itineraryFlight {
    origin: {
        name: string,
        code: string
    },
    destination: {
        name: string,
        code : string
    },
    passenger_detail:string,
    connecting_flight: itineraryconnectingflight[]
}

export interface itineraryconnectingflight {
    airlineCode: string,
    airlineName: string,
    airlineNumber: string,
    origin: {
        name: string,
        code: string,
        date : string
    },
    destination: {
        name: string,
        code: string,
        date : string
    },
    duration : string
}

//classes ----------------------------------------->>>>>>

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

export class AddEmailDetail {
    static readonly type = '[FlightResult] AddEmailDetail';
    constructor(public flightItem : itinerarytrip) {
        
    }
}

export class RemoveEmailDetail {
    static readonly type = '[FlightResult] RemoveEmailDetail';
    constructor(public flightItem: itinerarytrip) {

    }
}

export class ResetEmailDetail {
    static readonly type = '[FlightResult] ResetEmailDetail';
}

export class SelectedFlight {
    static readonly type = '[FlightResult] SelectedFlight';
    constructor(public currentFlight: resultObj) {

    }
}

@State<flight>({
    name: 'FlightResult',
    defaults: {
        oneway: null,
        roundtrip: null,
        multicity: null,
        emailtrip:null,
        emailItinerary: [],
        selectedFlight:null
    }
})

export class FlightResultState{

    constructor(
        private store : Store
    ) {

    }

    @Selector([FilterState]) 
    static getOneWay(states: flight,filterState:filter): resultObj[]{
        return states.oneway.value.filter(
            el =>
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes(el.name)
        );
    }

    @Selector([FilterState])
    static getDomesticDepartureRoundTrip(states: flight, filterState: filter): resultObj[] {
        return states.roundtrip.values.departure.filter(
            el =>
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes(el.name)
        );
    }

    @Selector([FilterState])
    static getDomesticReturnRoundTrip(states: flight, filterState: filter): resultObj[] {
        return states.roundtrip.values.return.filter(
            el =>
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes(el.name)
        );
    }

    @Selector([FilterState])
    static getInternationalRoundTrip(states: flight, filterState: filter): resultObj[] {
        return states.roundtrip.value.filter(
            el =>
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes(el.name)
        );
    }

    @Selector([FilterState])
    static getMultiWay(states: flight, filterState: filter): resultObj[] {
        return states.multicity.value.filter(
            el =>
                (filterState.stops !== null ? el.stops == filterState.stops : el) &&
                moment(el.departure).hour() <= filterState.depatureHours &&
                moment(el.arrival).hour() <= filterState.arrivalHours &&
                filterState.airlines.includes(el.name)
        );
    }

    @Selector()
    static mailStatus(states: flight): boolean {
        return states.emailItinerary.length == 0 ? false : true; 
    }

    @Selector()
    static getItinerary(states: flight): itinerarytrip[] {
        return states.emailItinerary;
    }

    @Selector()
    static getemailTrip(states: flight): emailtrip {
        return states.emailtrip;
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
            },
            emailtrip: this.emailTrips(action.response.Results[0])
        });


        this.store.dispatch(new GetAirlines(states.getState().oneway.value));
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
                },
                emailtrip: this.emailTrips(action.response.Results[0])
            });

            this.store.dispatch(new GetAirlines(states.getState().roundtrip.value));
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
                },
                emailtrip: this.emailTrips(action.response.Results[0])
            });

            this.store.dispatch(new GetAirlines(states.getState().roundtrip.values.departure));
            this.store.dispatch(new GetAirlines(states.getState().roundtrip.values.return));
            this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'round-trip','domestic']));

        }
    }

    @Action(MultiCityResponse)
    multicityResponse(states: StateContext<flight>, action: MultiCityResponse) {
        states.patchState({
            multicity: {
                value: this.responseDate(action.response.Results[0], action.response.TraceId),
                traceId: action.response.TraceId
            },
            emailtrip: this.emailTrips(action.response.Results[0])
        });

        this.store.dispatch(new GetAirlines(states.getState().multicity.value));
    }

    @Action(AddEmailDetail) 
    addEmailDetail(states: StateContext<flight>, action: AddEmailDetail) {
        let emailArray = Object.assign([], states.getState().emailItinerary);
        if (emailArray == null) {
            emailArray = [];
        }
        emailArray.push(action.flightItem);
        states.patchState({
            emailItinerary: emailArray
        });
    }
    
    @Action(RemoveEmailDetail)
    removeEmailDetail(states: StateContext<flight>, action: RemoveEmailDetail) {
        let emailArray = Object.assign([], states.getState().emailItinerary);
        const currentArray = emailArray.filter(el => el !== action.flightItem);
        states.patchState({
            emailItinerary: currentArray
        });
    }

    @Action(ResetEmailDetail)
    resetEmailDetail(states: StateContext<flight>, action: ResetEmailDetail) {
        states.patchState({
            emailItinerary:null
        });
    }

    @Action(SelectedFlight)
    selectedFlight(states: StateContext<flight>, action: SelectedFlight) {
        states.patchState({
            selectedFlight: action.currentFlight
        });
    }

    responseDate(response: flightResult[],traceId : string): resultObj[] {

        let resultObj: resultObj[] = new Array(response.length);

        response.forEach(
            (element: flightResult, index, array) => {

                let trips: trips[] = new Array(element.Segments.length);
                let totalDuration: number = 0;
                let lastArrival: string;
                let stops: number = 0;
                let baggage: baggage[][] = [];
                let email: itinerarytrip = {
                    class: this.getCabinClass(element.Segments[0][0].CabinClass),
                    refundable: element.IsRefundable == true ? 'refund' : 'non-refund',
                    fare: element.Fare.PublishedFare,
                    flights:[]
                };

                element.Segments.forEach(
                    (el, ind, arr) => {

                        baggage[ind] = [];

                        let lastFlight = el.length - 1;
                        email.flights[ind] = {
                            origin: {
                                name:el[0].Origin.Airport.CityName,
                                code:el[0].Origin.Airport.CityCode
                            },
                            destination: {
                                name: el[lastFlight].Destination.Airport.CityName,
                                code: el[lastFlight].Destination.Airport.CityCode
                            },
                            passenger_detail: "1 Adult",
                            connecting_flight:[]
                        }

                        el.forEach(
                            (e, i, a) => {
                                
                                email.flights[ind].connecting_flight[i] = {
                                    airlineCode:e.Airline.AirlineCode,
                                    airlineName:e.Airline.AirlineName,
                                    airlineNumber:e.Airline.FlightNumber,
                                    origin: {
                                        name:e.Origin.Airport.CityName,
                                        code:e.Origin.Airport.CityCode,
                                        date:e.Origin.DepTime
                                    },
                                    destination: {
                                        name:e.Destination.Airport.CityName,
                                        code:e.Destination.Airport.CityCode,
                                        date:e.Destination.ArrTime
                                    },
                                    duration: moment.duration(e.Duration, 'minutes').days() + "d " + moment.duration(e.Duration, 'minutes').hours() + "h " + moment.duration(e.Duration, 'minutes').minutes() + "m"
                                }

                                baggage[ind][i] = {
                                    originName: e.Origin.Airport.CityName,
                                    destinationName:e.Destination.Airport.CityName,
                                    baggage: e.Baggage,
                                    cabinBaggage:e.CabinBaggage
                                }
                            }
                        );


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
                    fare: element.Fare.PublishedFare,
                    Duration: totalDuration,
                    departure: element.Segments[0][0].Origin.DepTime,
                    arrival: lastArrival,
                    currency: element.Fare.Currency,
                    seats: element.Segments[0][0].NoOfSeatAvailable,
                    trips: trips,
                    baggage: baggage,
                    connectingFlights: element.Segments,
                    fareRule: fareRule,
                    stops: stops,
                    email : email
                };

            }
        );

        return resultObj;
    }

    emailTrips(response: flightResult[]): emailtrip {

        let lastSegment = response[0].Segments.length - 1;
        let lastconnectingflight = response[0].Segments[lastSegment].length - 1;

        return {
            departure: {
                name: response[0].Segments[0][0].Origin.Airport.CityName,
                code: response[0].Segments[0][0].Origin.Airport.CityCode
            },
            arrival: {
                name: response[0].Segments[lastSegment][lastconnectingflight].Destination.Airport.CityName,
                code: response[0].Segments[lastSegment][lastconnectingflight].Destination.Airport.CityCode
            }
        }
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