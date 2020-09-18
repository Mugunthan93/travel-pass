import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { FlightResultState } from './result/flight.state';
import { HotelResultState } from './result/hotel.state';
import { BusResultState } from './result/bus.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';

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
    },
    children: [
        FlightResultState,
        HotelResultState,
        BusResultState
    ]
})
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

        if (resultType == 'animated-round-trip') {
            resultType = 'round-trip';
        }
        if (resultMode == 'flight') {
            states.dispatch(new Navigate(['/', 'home', 'search', resultMode, resultType]));
        }
        else {
            states.dispatch(new Navigate(['/', 'home', 'search', resultMode]));
        }
        states.dispatch(new StateReset(ResultState));
    }


    
}