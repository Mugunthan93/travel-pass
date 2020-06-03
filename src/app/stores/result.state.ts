import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FlightResultState } from './result/flight.state';

export interface result{
    mode : string
}

export class ResultType {
    static readonly type = '[Result] ResultType';
    constructor(public result: string) {

    }
}


@State<result>({
    name: 'Result',
    defaults: {
        mode: null
    },
    children: [
        FlightResultState
    ]
})
export class ResultState {

    @Selector()
    static getSearchType(state: result) {
        return state.mode;
    }

    constructor() {

    }

    @Action(ResultType)
    searchType(states: StateContext<result>, action: ResultType) {
        states.setState({
            mode: action.result
        });
    }
    
}