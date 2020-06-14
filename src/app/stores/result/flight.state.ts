import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { flightSearchResult, flightResult, flightData } from 'src/app/models/search/flight';
import * as moment from "moment";
import { Navigate } from '@ngxs/router-plugin';

export interface flight{
    oneway: onewayResult
    roundtrip: roundtripResult
    multicity: multicityResult
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
    fareRule:fareRule
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


@State<flight>({
    name: 'FlightResult',
    defaults: {
        oneway: null,
        roundtrip: null,
        multicity: null
    }
})
export class FlightResultState{

    constructor(
        private store : Store
    ) {

    }

    @Selector() 
    static getOneWay(states: flight): resultObj[]{
        return states.oneway.value;
    }

    @Selector()
    static getRoundTrip(states: flight): roundtripResult {
        return states.roundtrip;
    }

    @Selector()
    static getMultiWay(states: flight): resultObj[] {
        return states.multicity.value;
    }


    @Action(OneWayResponse)
    onewayResponse(states: StateContext<flight>, action: OneWayResponse) {
        states.patchState({
            oneway: {
                value: this.responseDate(action.response.Results[0], action.response.TraceId),
                traceId: action.response.TraceId
            }
        });
        console.log(states.getState());
    }

    @Action(RoundTripResponse)
    roundtripResponse(states: StateContext<flight>, action: RoundTripResponse) {
        if (action.response.Results.length == 1) {
            states.patchState({
                roundtrip: {
                    value: this.responseDate(action.response.Results[0], action.response.TraceId),
                    values: {
                        departure: null,
                        return:null
                    },
                    traceId: action.response.TraceId
                }
            });
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
    }

    responseDate(response: flightResult[],traceId : string): resultObj[] {

        let resultObj: resultObj[] = new Array(response.length);

        response.forEach(
            (element: flightResult, index, array) => {

                let trips: trips[] = new Array(element.Segments.length);
                let totalDuration: number = 0;
                let lastArrival: string;

                element.Segments.forEach(
                    (el, ind, arr) => {

                        lastArrival = el[el.length - 1].Destination.ArrTime;
                        totalDuration += this.getDuration(el);

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
                                duration: moment.duration(this.getDuration(el), 'minutes').hours() + "h " + moment.duration(this.getDuration(el), 'minutes').minutes() + "m",
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
                    fareRule: fareRule
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

}