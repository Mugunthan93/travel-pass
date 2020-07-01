import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';


export interface booking {
    type: string
    new: any[]
    history: any[]
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
        public menuCtrl: MenuController,
        private flightService : FlightService
    ) {

    }

    @Selector()
    static getNewBooking(state: booking) : any[] {
        return state.new;
    }

    @Selector()
    static getHistoryBooking(state: booking) : any[] {
        return state.history;
    }

    @Action(MyBooking)
    async myflightBooking(states: StateContext<booking>, action: MyBooking) {

        states.patchState({
            type : action.type
        });

        let newBooking = [];
        let historyBooking = [];

        try {
            const userId: number = this.store.selectSnapshot(UserState.getUserId);
            const myBookingResponse = await this.flightService.openBooking(userId);
            console.log(myBookingResponse);
            let openBooking = JSON.parse(myBookingResponse.data);
            historyBooking.push(...openBooking.data);
            newBooking.push(...openBooking.data);
        }
        catch (error) {
            console.log(error);
        }

        try {
            const userId: number = this.store.selectSnapshot(UserState.getUserId);
            const myBookingResponse = await this.flightService.pendingBooking(userId);
            console.log(myBookingResponse);
            let pendingBooking = JSON.parse(myBookingResponse.data);
            console.log(pendingBooking);
            newBooking.push(...pendingBooking.data);
        }
        catch (error) {
            console.log(error);
        }

        states.patchState({
            new: newBooking,
            history:historyBooking
        });

        this.menuCtrl.close('first');
        this.store.dispatch(new Navigate(['/', 'home', 'my-booking', states.getState().type, 'new']));
    }

}