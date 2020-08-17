import { State, Selector, Action, StateContext } from '@ngxs/store';
import { resultObj } from './flight.state';
import * as _ from 'lodash';


export interface filter {
    flight: flightFilter
    hotel : hotelFilter
}

export interface flightFilter {
    stops: number
    depatureHours: number
    arrivalHours: number
    corporateFare: boolean
    airlines: airlineName[]
    price: number
}

export interface hotelFilter {

}

export interface airlineName {
    name: string,
    value:boolean
}

export class GetAirlines {
    static readonly type = '[Filter] GetAirlines';
    constructor(public result: resultObj[]) {

    }
}

export class GetFilter {
    static readonly type = '[Filter] GetFilter';
    constructor(public filter: flightFilter) {

    }
}

@State<filter>({
    name: 'filter',
    defaults: {
        flight: {
            stops: -1,
            depatureHours: 24,
            arrivalHours: 24,
            corporateFare: false,
            airlines: [],
            price: 0
        },
        hotel : null
    }
})

export class FilterState {

    @Selector()
    static getFlightFilter(states: filter) {
        return states.flight;
    }

    @Action(GetAirlines)
    getAirlines(states: StateContext<filter>, action: GetAirlines) {
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
            flight: {
                stops: -1,
                depatureHours: 24,
                arrivalHours: 24,
                corporateFare: false,
                airlines: _.uniqBy(airlines, 'name'),
                price: 0
            }
        })
    }

    @Action(GetFilter)
    getFilter(states: StateContext<filter>, action: GetFilter) {
        states.patchState({
            flight: action.filter
        });
    }

}