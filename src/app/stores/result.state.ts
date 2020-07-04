import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { FlightResultState } from './result/flight.state';

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

@State<result>({
    name: 'Result',
    defaults: {
        mode: null,
        type:null
    },
    children: [
        FlightResultState
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
    
}