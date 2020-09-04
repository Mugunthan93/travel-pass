import { State, Selector, Action, StateContext } from '@ngxs/store';
import { resultObj } from './flight.state';
import * as _ from 'lodash';


export interface filter {
    flight: flightFilter
    departure: flightFilter
    return: flightFilter
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
    constructor(public result: resultObj[], public type? : string) {

    }
}

export class GetFilter {
    static readonly type = '[Filter] GetFilter';
    constructor(public filter: flightFilter,public type? : string) {

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
        departure: {
            stops: -1,
            depatureHours: 24,
            arrivalHours: 24,
            corporateFare: false,
            airlines: [],
            price: 0
        },
        return: {
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

    @Selector()
    static getDepartureFlightFilter(states: filter) {
        return states.departure;
    }

    @Selector()
    static getReturnFlightFilter(states: filter) {
        return states.return;
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

        if (action.type == 'departure') {
            states.patchState({
                departure: {
                    stops: -1,
                    depatureHours: 24,
                    arrivalHours: 24,
                    corporateFare: false,
                    airlines: _.uniqBy(airlines, 'name'),
                    price: 0
                }
            })
        }
        else if (action.type == 'return') {
            states.patchState({
                return: {
                    stops: -1,
                    depatureHours: 24,
                    arrivalHours: 24,
                    corporateFare: false,
                    airlines: _.uniqBy(airlines, 'name'),
                    price: 0
                }
            })
        }
        else {
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

    }

    @Action(GetFilter)
    getFilter(states: StateContext<filter>, action: GetFilter) {
        if (action.type == 'departure') {
            states.patchState({
                departure: action.filter
            });
        }
        else if (action.type == 'return') {
            states.patchState({
                return: action.filter
            });
        }
        else if(action.type == undefined){
            states.patchState({
                flight: action.filter
            });
        }
    }

}