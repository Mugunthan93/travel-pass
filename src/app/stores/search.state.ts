import { State, Action, StateContext, Selector } from "@ngxs/store";
import { FLightState } from './search/flight.state';

export class SearchType {
    static readonly type = '[Search] SearchType';
    constructor(public search: string) {

    }
}


@State<any>({
    name: 'Search',
    defaults: null,
    children: [
        FLightState
    ]
})
export class SearchState {

    @Selector()
    static getSearchType(state: string) {
        return state;
    }

    constructor() {

    }

    @Action(SearchType)
    searchType(states: StateContext<any>, action: SearchType) {
        states.setState(action.search);
    }

}