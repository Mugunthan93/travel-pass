import { State, Action, StateContext, Store } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController } from '@ionic/angular';


export interface booking {
    type: string
    new: any
    history: any
}

export class MyBooking {
    static readonly type = "[booking] MyBooking";
    constructor(public type : string) {

    }
}

@State<booking>({
    name: 'booking',
    defaults: {
        type: null,
        new: null,
        history: null
    }
})
export class BookingState {

    constructor(
        private store: Store,
        public menuCtrl: MenuController
    ) {

    }

    @Action(MyBooking)
    myflightBooking(states: StateContext<booking>, action: MyBooking) {
        states.patchState({
            type : action.type
        });
        this.menuCtrl.toggle('first');
        this.store.dispatch(new Navigate(['/', 'home', 'my-booking', states.getState().type, 'new']));
    }

}