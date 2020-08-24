import { State, Selector, Action, Store, StateContext } from '@ngxs/store';
import { FLightBookState } from './book/flight.state';
import { HotelBookState } from './book/hotel.state';
import { BusBookState } from './book/bus.state';

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
}