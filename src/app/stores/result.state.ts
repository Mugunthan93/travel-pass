import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { Injectable } from '@angular/core';
import { FlightResultState } from './result/flight.state';
import { DomesticResultState } from './result/flight/domestic.state';
import { OneWayResultState } from './result/flight/oneway.state';
import { InternationalResultState } from './result/flight/international.state';
import { MultiCityResultState } from './result/flight/multi-city.state';
import { HotelResultState } from './result/hotel.state';

export interface result{
    mode: string,
    type: string
}


export class ResultMode {
    static readonly type = '[Result] ResultMode';
    constructor(public mode : string) {

    }
}

export class ResultType {
    static readonly type = '[Result] ResultType';
    constructor(public type: string) {

    }
}

export class ResultBack {
    static readonly type = '[Result] ResultBack';
}

@State<result>({
    name: 'Result',
    defaults: {
        mode: null,
        type:null
    }
})

@Injectable()
export class ResultState {

    @Selector()
    static getResultMode(state: result) {
        return state.mode;
    }

    @Selector()
    static getResultType(state: result) {
        return state.type;
    }

    constructor(
        private store: Store
    ) {

    }

    @Action(ResultType)
    resultType(states: StateContext<result>, action: ResultType) {
        states.patchState({
            type: action.type
        });

    }


    @Action(ResultMode)
    resultMode(states: StateContext<result>, action: ResultMode) {
        states.patchState({
            mode: action.mode
        });
    }

    @Action(ResultBack)
    resultBack(states: StateContext<result>) {
        let resultMode: string = states.getState().mode;
        let resultType: string = states.getState().type;

        if (resultMode == 'flight') {
            if (resultType == 'animated-round-trip') {
                states.dispatch([
                  new Navigate(['/', 'home', 'search', resultMode, 'round-trip']),
                  new StateReset(DomesticResultState,FlightResultState,ResultState)
                ]);
            }
            else {
                states.dispatch([
                  new Navigate(['/', 'home', 'search', resultMode, resultType]),
                  new StateReset(OneWayResultState,InternationalResultState,MultiCityResultState,FlightResultState,ResultState)
                ]);
            }
        }
        else if(resultMode == 'hotel') {
          states.dispatch([
            new Navigate(['/', 'home', 'search', resultMode]), 
            new StateReset(HotelResultState,ResultState)
          ]);
        }
        else {
            states.dispatch([
              new Navigate(['/', 'home', 'search', resultMode])
            ]);
        }
        states.dispatch(new StateReset(ResultState));
    }



}
