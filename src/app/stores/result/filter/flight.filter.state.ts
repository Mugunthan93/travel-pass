import { State, Action, StateContext, Selector } from "@ngxs/store";
import { resultObj } from '../flight.state';
import * as _ from 'lodash';


export interface flightFilter {
    stops: number
    depatureHours: number
    arrivalHours: number
    corporateFare: boolean
    airlines: airlineName[]
    price: number
}

export interface airlineName {
    name: string,
    value: boolean
}

export class SetFlightStops {
    static readonly type = '[flight_filter] SetStops';
    constructor(public stops : number) {

    }
}

export class SetFlightDeparture {
    static readonly type = '[flight_filter] SetDeparture';
    constructor(public dep: number) {

    }
}

export class SetFlightArrival {
    static readonly type = '[flight_filter] SetArrival';
    constructor(public arr: number) {

    }
}

export class SetFlightCorpFare {
    static readonly type = '[flight_filter] SetCorpFare';
    constructor(public fare: boolean) {

    }
}

export class SetFlightAirlines {
    static readonly type = '[flight_filter] SetAirlines';
    constructor(public airlines: airlineName, public airboolean: boolean) {

    }
}

export class SetFlightPrice {
    static readonly type = '[flight_filter] SetPrice';
    constructor(public price: number) {

    }
}

export class ResetFlightAirlines {
    static readonly type = '[flight_filter] ResetFlightAirlines';
}



export class GetAirlines {
    static readonly type = '[flight_filter] GetAirlines';
    constructor(public result: resultObj[], public type?: string) {

    }
}

export class GetFilter {
    static readonly type = '[flight_filter] GetFilter';
    constructor(public filter: flightFilter, public type?: string) {

    }
}


@State<flightFilter>({
    name: 'flight_filter',
    defaults: {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: [],
        price: 0
    }
})
export class FlightFilterState {

    constructor() {

    }

    @Selector()
    static getFlightFilter(states: flightFilter) {
        return states;
    }

    @Action(GetAirlines)
    getAirlines(states: StateContext<flightFilter>, action: GetAirlines) {
        let airlines: airlineName[] = [];
        action.result.forEach(
            (el) => {
                airlines.push({
                    name: el.name,
                    value: false
                });
            }
        );

        states.patchState({
            stops: -1,
            depatureHours: 24,
            arrivalHours: 24,
            corporateFare: false,
            airlines: _.uniqBy(airlines, 'name'),
            price: 0
        })

    }

    @Action(SetFlightStops)
    setStops(states: StateContext<flightFilter>, action: SetFlightStops) {
        states.patchState({
            stops : action.stops
        });
    }

    @Action(SetFlightDeparture)
    setdeparture(states: StateContext<flightFilter>, action: SetFlightDeparture) {
        states.patchState({
            depatureHours: action.dep
        });
    }

    @Action(SetFlightArrival)
    setArrrival(states: StateContext<flightFilter>, action: SetFlightArrival) {
        states.patchState({
            arrivalHours: action.arr
        });
    }

    @Action(SetFlightCorpFare)
    setcorpFare(states: StateContext<flightFilter>, action: SetFlightCorpFare) {
        states.patchState({
            corporateFare: action.fare
        });
    }

    @Action(SetFlightAirlines)
    setAirline(states: StateContext<flightFilter>, action: SetFlightAirlines) {

        let airlines: airlineName[] = Object.assign([], states.getState().airlines);
        let setairline: airlineName[] = airlines.map(
            (el) => {
                if (_.isEqual(el,action.airlines)) {
                    let newair: airlineName = Object.assign({}, el);
                    newair.value = action.airboolean;
                    return newair;
                }
                return el;
            }
        );

        states.patchState({
            airlines: setairline
        });
    }

    @Action(SetFlightPrice)
    setPrice(states: StateContext<flightFilter>, action: SetFlightPrice) {
        states.patchState({
            price : action.price
        });
    }

    @Action(ResetFlightAirlines)
    resetAirlines(states: StateContext<flightFilter>) {
        let airlines: airlineName[] = Object.assign([],states.getState().airlines);
        let init: airlineName[] = airlines.map(
            (el) => {
                let item: airlineName = Object.assign({},el);
                item.value = false;
                return item;
            }
        );

        states.patchState({
            airlines : init
        });
    }

    @Action(GetFilter)
    getFilter(states: StateContext<flightFilter>, action: GetFilter) {
        states.patchState(action.filter);
    }

}