import { State, Selector, Action, StateContext } from '@ngxs/store';
import { resultObj } from './flight.state';
import * as _ from 'lodash';


export interface filter {
    stops: number
    depatureHours: number
    arrivalHours: number
    corporateFare: boolean
    airlines: string[]
}

export class GetAirlines {
    static readonly type = '[Filter] GetAirlines';
    constructor(public result: resultObj[]) {

    }
}

@State<filter>({
    name: 'filter',
    defaults: {
        stops: null,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: []
    }
})

export class FilterState {

    @Selector()
    static getFilter(states: filter) {
        return states;
    }

    @Action(GetAirlines)
    getAirlines(states: StateContext<filter>, action: GetAirlines) {
        let airlines: string[] = [];
        action.result.forEach(
            (el) => {
                airlines.push(el.name);
            }
        );

        states.patchState({
                stops: null,
                depatureHours: 24,
                arrivalHours: 24,
                corporateFare: false,
                airlines: _.sortedUniq(airlines)
        })
    }

}