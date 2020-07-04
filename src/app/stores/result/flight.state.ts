import { State, Store, Selector, Action, StateContext } from '@ngxs/store';
import { flightResult, flightData } from 'src/app/models/search/flight';
import * as moment from "moment";
import * as _ from "lodash";
import { OneWayResultState } from './flight/oneway.state';
import { MultiCityResultState } from './flight/multi-city.state';
import { DomesticResultState } from './flight/domestic.state';
import { InternationalResultState } from './flight/international.state';

export interface flight {
    sort: sortButton[],
    emailtrip: emailtrip,
    emailItinerary:itinerarytrip[]
}

export interface sortButton {
    value: string
    state : string
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
    from: any;
    to: any;
    departure: any;
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

export interface SSR {
    Baggage: any[][]
    Error: { ErrorCode: number, ErrorMessage: string }
    MealDynamic: any[][]
    ResponseStatus: number
    SeatDynamic: any[]
    specialServices:any[]
    TraceId: string
}

//classes ----------------------------------------->>>>>>

export class SortChange {
    static readonly type = '[Flight] DepartureSort';
    constructor(public button : sortButton) {

    }
}

export class AddEmailTrips {
    static readonly type = '[Flight] AddEmailTrips';
    constructor(public emailtrip: emailtrip) {

    }
}

export class AddEmailDetail {
    static readonly type = '[Flight] AddEmailDetail';
    constructor(public flightItem: itinerarytrip) {

    }
}

export class RemoveEmailDetail {
    static readonly type = '[Flight] RemoveEmailDetail';
    constructor(public flightItem: itinerarytrip) {

    }
}

@State<flight>({
    name: 'flight_result',
    defaults: {
        sort: [
            { value: 'departure', state: 'deafult' },
            {value : 'arrival',state : 'default'},
            {value : 'duration',state : 'default'},
            { value: 'price', state: 'default' }
        ],
        emailtrip: null,
        emailItinerary:[]
    },
    children: [
        OneWayResultState,
        DomesticResultState,
        InternationalResultState,
        MultiCityResultState
    ]
})

export class FlightResultState{

    constructor(
    ) {

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

    @Selector()
    static getButtons(states : flight): sortButton[] {
        return states.sort;
    }

    @Action(SortChange)
    sortChange(states: StateContext<flight>, action: SortChange) {
        let currentState: sortButton[] = states.getState().sort;
        currentState.forEach(
            (el) => {
                if (el !== action.button) {
                    el.state = "default";
                }
            }
        );
        states.patchState({ sort: currentState });
    }

    @Action(AddEmailTrips)
    addEmailTrips(states: StateContext<flight>, action: AddEmailTrips) {
        states.patchState({
            emailtrip : action.emailtrip
        });
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
}