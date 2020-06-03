import { State, Action, StateContext, Selector } from "@ngxs/store";
import { FlightSearchState } from './search/flight.state';

export interface search{
    mode : string
}

export class SearchType {
    static readonly type = '[Search] SearchType';
    constructor(public search: string) {

    }
}


@State<search>({
    name: 'Search',
    defaults: {
        mode : null
    },
    children: [
        FlightSearchState
    ]
})
export class SearchState {

    @Selector()
    static getSearchType(state: search) {
        return state.mode;
    }

    constructor() {

    }

    @Action(SearchType)
    searchType(states: StateContext<search>, action: SearchType) {
        states.setState({
            mode : action.search
        });
    }

}