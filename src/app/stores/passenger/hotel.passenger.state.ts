import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { from } from 'rxjs';

export interface hotelpassengerstate{
    adult: hotelpassenger[]
    children: hotelpassenger[]
    selectedAdult: hotelpassenger[]
    selectedChildren: hotelpassenger[]
}

export interface hotelpassenger {
    PaxType: number
    LeadPassenger: boolean
    count: number
    
    Title?: string
    FirstName: string
    LastName: string
    Age?: number
    Email?: string
    PAN?: string

    Gender?: string
}

export class AddAdultPassenger {
    static readonly type = "[hotel_passenger] AddAdultPassenger";
    constructor(public pass: hotelpassenger) {

    }
}

export class AddChildPassenger {
    static readonly type = "[hotel_passenger] AddChildPassenger";
    constructor(public pass: hotelpassenger) {

    }
}

export class DismissHotelPassenger {
    static readonly type = "[hotel_passenger] DismissHotelPassenger";

}

@State<hotelpassengerstate>({
    name: 'hotel_passenger',
    defaults: {
        adult: [],
        children: [],
        selectedAdult: [],
        selectedChildren: []
    }
})
export class HotelPassengerState {

    constructor(
        public modalCtrl : ModalController
    ) {
        
    }

    @Selector()
    static GetAdult(state: hotelpassengerstate): hotelpassenger[] {
        return state.adult;
    }

    @Selector()
    static GetTotalAdult(state: hotelpassengerstate): number {
        return state.adult.length;
    }

    @Selector()
    static GetTotalChildren(state: hotelpassengerstate): number {
        return state.children.length;
    }

    @Selector()
    static GetSelectedAdult(state: hotelpassengerstate): number {
        return state.selectedAdult.length;
    }

    @Selector()
    static GetSelectedChildren(state: hotelpassengerstate): number {
        return state.selectedChildren.length;
    }

    @Selector()
    static GetSelectAdult(state: hotelpassengerstate): hotelpassenger[] {
        return state.selectedAdult;
    }

    @Selector()
    static GetSelectChildren(state: hotelpassengerstate): hotelpassenger[] {
        return state.selectedChildren;
    }

    @Selector()
    static GetChild(state: hotelpassengerstate): hotelpassenger[] {
        return state.children;
    }

    @Action(AddAdultPassenger)
    addAdult(states: StateContext<hotelpassengerstate>, action: AddAdultPassenger) {
        let currentAdult = Object.assign([], states.getState().adult);
        currentAdult.push(action.pass);

        states.patchState({
            adult: currentAdult
        });
    }

    @Action(AddChildPassenger)
    addChildren(states: StateContext<hotelpassengerstate>, action: AddChildPassenger) {
        let currentAdult = Object.assign([], states.getState().children);
        currentAdult.push(action.pass);

        states.patchState({
            children: currentAdult
        });
    }

    @Action(DismissHotelPassenger)
    dismissHotelPassenger(states: StateContext<hotelpassengerstate>) {
        return from(this.modalCtrl.dismiss(null, null,'passenger-list'));
    }

}