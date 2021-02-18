import { State, Action, StateContext, Selector } from "@ngxs/store";
import { resultObj } from '../flight.state';
import * as _ from 'lodash';
import { Injectable } from "@angular/core";


export interface departureFilter {
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

///////////////////////////////////////////////

export class ResetDepartureAirlines {
    static readonly type = '[flight_filter] ResetDepartureAirlines';
}

export class SetDepStops {
    static readonly type = '[flight_filter] SetDepStops';
    constructor(public stops: number) {

    }
}

export class SetDepDeparture {
    static readonly type = '[flight_filter] SetDepDeparture';
    constructor(public dep: number) {

    }
}

export class SetDepArrival {
    static readonly type = '[flight_filter] SetDepArrival';
    constructor(public arr: number) {

    }
}

export class SetDepCorpFare {
    static readonly type = '[flight_filter] SetDepCorpFare';
    constructor(public fare: boolean) {

    }
}

export class SetDepAirlines {
    static readonly type = '[flight_filter] SetDepAirlines';
    constructor(public airlines: airlineName,public airboolean : boolean) {

    }
}

export class SetDepPrice {
    static readonly type = '[flight_filter] SetDepPrice';
    constructor(public price: number) {

    }
}

export class GetDepartureAirlines {
    static readonly type = '[departure_filter] GetAirlines';
    constructor(public result: resultObj[], public type?: string) {

    }
}

export class GetDepartureFilter {
    static readonly type = '[departure_filter] GetDepartureFilter';
    constructor(public filter: departureFilter, public type?: string) {

    }
}


@State<departureFilter>({
    name: 'departure_filter',
    defaults: {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: [],
        price: 0
    }
})

@Injectable()
export class DepartureFilterState {

    constructor() {

    }

    @Selector()
    static getFlightFilter(states: departureFilter) {
        return states;
    }

    @Action(GetDepartureAirlines)
    getAirlines(states: StateContext<departureFilter>, action: GetDepartureAirlines) {
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

    @Action(SetDepStops)
    setStops(states: StateContext<departureFilter>, action: SetDepStops) {
        states.patchState({
            stops: action.stops
        });
    }

    @Action(SetDepDeparture)
    setdeparture(states: StateContext<departureFilter>, action: SetDepDeparture) {
        states.patchState({
            depatureHours: action.dep
        });
    }

    @Action(SetDepArrival)
    setArrrival(states: StateContext<departureFilter>, action: SetDepArrival) {
        states.patchState({
            arrivalHours: action.arr
        });
    }

    @Action(SetDepCorpFare)
    setcorpFare(states: StateContext<departureFilter>, action: SetDepCorpFare) {
        states.patchState({
            corporateFare: action.fare
        });
    }

    @Action(SetDepAirlines)
    setAirline(states: StateContext<departureFilter>, action: SetDepAirlines) {
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

    @Action(SetDepPrice)
    setPrice(states: StateContext<departureFilter>, action: SetDepPrice) {
        states.patchState({
            price: action.price
        });
    }

    @Action(ResetDepartureAirlines)
    resetAirlines(states: StateContext<departureFilter>) {
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

    @Action(GetDepartureFilter)
    getFilter(states: StateContext<departureFilter>, action: GetDepartureFilter) {
        states.patchState(action.filter);
    }

}
