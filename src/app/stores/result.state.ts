import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { SetServiceCharge } from './book/flight.state';
import { Injectable } from '@angular/core';

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
                states.dispatch(new Navigate(['/', 'home', 'search', resultMode, 'round-trip']));
            }
            else {
                states.dispatch(new Navigate(['/', 'home', 'search', resultMode, resultType]));
            }
        }
        else {
            states.dispatch(new Navigate(['/', 'home', 'search', resultMode]));
        }
        states.dispatch(new StateReset(ResultState));
    }



}
