import { State, Action, StateContext, Selector } from "@ngxs/store";
import { FlightSearchState } from './search/flight.state';
import { HotelSearchState } from './search/hotel.state';
import { BusSearchState } from './search/bus.state';
import { TrainSearchState } from './search/train.state';

export interface search{
    mode: string,
    type: string
}

export class SearchMode {
    static readonly type = '[Search] SearchMode';
    constructor(public mode: string) {

    }
}

export class SearchType {
    static readonly type = '[Search] SearchType';
    constructor(public type: string) {

    }
}


@State<search>({
    name: 'Search',
    defaults: {
        mode: null,
        type: null
    },
    children: [
        FlightSearchState,
        HotelSearchState,
        BusSearchState,
        TrainSearchState
    ]
})
export class SearchState {

    @Selector()
    static getSearchMode(state: search) {
        return state.mode;
    }

    @Selector()
    static getSearchType(state: search) {
        return state.type;
    }

    constructor() {

    }

    @Action(SearchType)
    searchType(states: StateContext<search>, action: SearchType) {
        states.patchState({
            type: action.type
        });
    }


    @Action(SearchMode)
    searchMode(states: StateContext<search>, action: SearchMode) {
        states.patchState({
            mode : action.mode
        });
    }

}