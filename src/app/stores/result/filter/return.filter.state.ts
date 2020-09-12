import { State, Action, StateContext, Selector } from "@ngxs/store";
import { resultObj } from '../flight.state';
import * as _ from 'lodash';


export interface returnFilter {
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


///////////////////////////////////////////////////

export class ResetReturnAirlines {
    static readonly type = '[flight_filter] ResetReturnAirlines';
}

export class SetReStops {
    static readonly type = '[flight_filter] SetReStops';
    constructor(public stops: number) {

    }
}

export class SetReDeparture {
    static readonly type = '[flight_filter] SetReDeparture';
    constructor(public dep: number) {

    }
}

export class SetReArrival {
    static readonly type = '[flight_filter] SetReArrival';
    constructor(public arr: number) {

    }
}

export class SetReCorpFare {
    static readonly type = '[flight_filter] SetReCorpFare';
    constructor(public fare: boolean) {

    }
}

export class SetReAirlines {
    static readonly type = '[flight_filter] SetReAirlines';
    constructor(public airlines: airlineName, public airboolean: boolean) {

    }
}

export class SetRePrice {
    static readonly type = '[flight_filter] SetPrice';
    constructor(public price: number) {

    }
}

export class GetReturnAirlines {
    static readonly type = '[return_filter] GetReturnAirlines';
    constructor(public result: resultObj[], public type?: string) {

    }
}

export class GetReturnFilter {
    static readonly type = '[return_filter] GetReturnFilter';
    constructor(public filter: returnFilter, public type?: string) {

    }
}


@State<returnFilter>({
    name: 'return_filter',
    defaults: {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: [],
        price: 0
    }
})
export class ReturnFilterState {

    constructor() {

    }

    @Selector()
    static getFlightFilter(states: returnFilter) {
        return states;
    }

    @Action(GetReturnAirlines)
    getAirlines(states: StateContext<returnFilter>, action: GetReturnAirlines) {
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

    @Action(SetReStops)
    setStops(states: StateContext<returnFilter>, action: SetReStops) {
        states.patchState({
            stops: action.stops
        });
    }

    @Action(SetReDeparture)
    setdeparture(states: StateContext<returnFilter>, action: SetReDeparture) {
        states.patchState({
            depatureHours: action.dep
        });
    }

    @Action(SetReArrival)
    setArrrival(states: StateContext<returnFilter>, action: SetReArrival) {
        states.patchState({
            arrivalHours: action.arr
        });
    }

    @Action(SetReCorpFare)
    setcorpFare(states: StateContext<returnFilter>, action: SetReCorpFare) {
        states.patchState({
            corporateFare: action.fare
        });
    }

    @Action(SetReAirlines)
    setAirline(states: StateContext<returnFilter>, action: SetReAirlines) {
        let airlines: airlineName[] = Object.assign([], states.getState().airlines);
        let setairline: airlineName[] = airlines.map(
            (el) => {
                if (_.isEqual(el, action.airlines)) {
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

    @Action(SetRePrice)
    setPrice(states: StateContext<returnFilter>, action: SetRePrice) {
        states.patchState({
            price: action.price
        });
    }

    @Action(ResetReturnAirlines)
    resetAirlines(states: StateContext<returnFilter>) {
        let airlines: airlineName[] = Object.assign([], states.getState().airlines);
        let init: airlineName[] = airlines.map(
            (el) => {
                el.value = false;
                return el;
            }
        );

        states.patchState({
            airlines: init
        });
    }

    @Action(GetReturnFilter)
    getFilter(states: StateContext<returnFilter>, action: GetReturnFilter) {
        states.patchState(action.filter);
    }

}