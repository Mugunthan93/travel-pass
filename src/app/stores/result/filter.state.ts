import { State, Selector, Action, StateContext } from '@ngxs/store';
import { resultObj } from './flight.state';
import * as _ from 'lodash';


export interface filter {
    stops: number
    depatureHours: number
    arrivalHours: number
    corporateFare: boolean
    airlines: airlineName[]
    price: number
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
    constructor(public filter: filter) {

    }
}

@State<filter>({
    name: 'filter',
    defaults: {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: [],
        price : 0
    }
})

export class FilterState {

    @Selector()
    static getFilter(states: filter) {
        return states;
    }

    @Action(GetAirlines)
    getAirlines(states: StateContext<filter>, action: GetAirlines) {
        let airlines: airlineName[] = [];
        action.result.forEach(
            (el) => {
                airlines.push({
                    name: el.name,
                    value: true
                });
            }
        );

        states.patchState({
                stops: -1,
                depatureHours: 24,
                arrivalHours: 24,
                corporateFare: false,
                airlines: _.uniqBy(airlines,'name')
        })
    }

    @Action(GetFilter)
    getFilter(states: StateContext<filter>, action: GetFilter) {
        states.patchState(action.filter);
    }

}