import { State, Selector, Action, Store, StateContext } from '@ngxs/store';
import { FLightBookState } from './book/flight.state';
import { HotelBookState } from './book/hotel.state';
import { BusBookState } from './book/bus.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';

export interface book {
    mode: string,
    type: string
}

export class BookType {
    static readonly type = "[book] BookType"
    constructor(public type : string) {

    }
}

export class BookMode {
    static readonly type = "[book] BookMode"
    constructor(public mode: string) {

    }
}

export class BookBack {
    static readonly type = "[book] BookBack"
}

@State<book>({
    name: 'Book',
    defaults: {
        mode: null,
        type: null
    },
    children: [
        FLightBookState,
        HotelBookState,
        BusBookState
    ]
})

export class BookState {
    
    @Selector()
    static getBookMode(state: book) {
        return state.mode;
    }

    @Selector()
    static getBookType(state: book) {
        return state.type;
    }

    constructor(
        private store: Store
    ) {

    }

    @Action(BookType)
    bookType(states: StateContext<book>, action: BookType) {
        states.patchState({
            type: action.type
        });

    }


    @Action(BookMode)
    bookMode(states: StateContext<book>, action: BookMode) {
        states.patchState({
            mode: action.mode
        });
    }

    @Action(BookBack)
    bookback(states: StateContext<book>) {
        let bookMode: string = states.getState().mode;
        let bookType: string = states.getState().type;

        if (bookType == 'animated-round-trip') {
            bookType = 'round-trip';
        }
        if (bookMode == 'flight') {
            states.dispatch(new Navigate(['/', 'home', 'result', bookMode, bookType]));
        }
        else {
            states.dispatch(new Navigate(['/', 'home', 'result', bookMode]));
        }
        states.dispatch(new StateReset(BookState));
    }
}