import { State, Action, StateContext, Store } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { SearchType, SearchMode } from './search.state';
import { JourneyType } from './search/flight.state';

export class SearchFlight{
    static readonly type = '[Dashboard] SearchFlight';
    constructor() {
        
    }
}

export class SearchBus {
    static readonly type = '[Dashboard] SearchBus';
    constructor() {

    }
}

export class SearchHotel {
    static readonly type = '[Dashboard] SearchHotel';
    constructor() {

    }
}


@State({
    name: 'Dashboard',
    defaults:null
})
export class DashboardState{

    constructor(
        private store: Store
    ) {
        
    }

    @Action(SearchFlight)
    searchFlight(states: StateContext<any>, action: SearchFlight) {
        this.store.dispatch(new SearchMode('Flight'));
        this.store.dispatch(new SearchType('one-way'));
        this.store.dispatch(new JourneyType('one-way'));
        this.store.dispatch(new Navigate(['/', 'home', 'search', 'flight', 'one-way']));
        
    }

    @Action(SearchBus)
    searchBus() {
        this.store.dispatch(new SearchType('Bus'));
        this.store.dispatch(new Navigate(['/', 'home', 'search','bus']));
    }

    @Action(SearchHotel)
    searchHotel() {
        this.store.dispatch(new SearchType('Hotel'));
        this.store.dispatch(new Navigate(['/', 'home', 'search','hotel']));
    }

    // @Action(SearchFlight)
    // searchCab() {

    // }
}