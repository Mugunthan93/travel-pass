import { State, Action, StateContext } from '@ngxs/store';
import { flightResult } from 'src/app/models/search/flight';
import { SSR } from '../result/flight.state';


export interface flight{
    flight: flightResult,
    baggage: baggage[][],
    meal: mealDynamic[][],
    seat: SegmentSeat[],
    specialServices: any[]
}

export interface baggage {
    AirlineCode: string
    Code: string
    Currency: string
    Description: number
    Destination: string
    FlightNumber: string
    Origin: string
    Price: number
    WayType: number
    Weight: number
}

export interface mealDynamic {
    AirlineCode: string
    AirlineDescription: string
    Code: string
    Currency: string
    Description: number
    Destination: string
    FlightNumber: string
    Origin: string
    Price: number
    Quantity: number
    WayType: number
}

export interface SegmentSeat {
    SegmentSeat: rowseats[]
}

export interface rowseats{
    rowseats : seats[]
}

export interface seats {
    seats : seat[]
}

export interface seat{
    AirlineCode: string
    AvailablityType: number
    Code: string
    Compartment: number
    CraftType: string
    Currency: string
    Deck: number
    Description: number
    Destination: string
    FlightNumber: string
    Origin: string
    Price: number
    RowNo: any
    SeatNo: string
    SeatType: number
    SeatWayType: number
}

export class GetFlightDetail{
    static readonly type = "[flight] GetFlightDetail";
    constructor(public fairQuote: flightResult, public ssr: SSR) {

    }
}

@State<flight>({
    name: 'flight',
    defaults: {
        flight: null,
        baggage: null,
        meal: null,
        seat: null,
        specialServices:null
    }
})

export class FLightBookState {

    constructor() {

    }

    @Action(GetFlightDetail)
    getFlightDetail(states: StateContext<flight>, action: GetFlightDetail) {
        states.patchState({
            flight: action.fairQuote,
            baggage: action.ssr.Baggage,
            meal: action.ssr.MealDynamic,
            seat: action.ssr.SeatDynamic,
            specialServices:action.ssr.specialServices
        });
    }
}