import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { ModalController, PopoverController } from '@ionic/angular';
import { from } from 'rxjs';
import * as _ from 'lodash';
import { ListEmployeeComponent } from 'src/app/components/shared/list-employee/list-employee.component';
import { user } from 'src/app/models/user';
import { CompanyState } from '../company.state';
import { map, flatMap } from 'rxjs/operators';

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

export class EditAdultPassenger {
    static readonly type = "[hotel_passenger] EditAdultPassenger";
    constructor(public pass: hotelpassenger, public pax : hotelpassenger) {

    }
}

export class DeleteAdultPassenger {
    static readonly type = "[hotel_passenger] DeleteAdultPassenger";
    constructor(public pax: hotelpassenger) {

    }
}

export class SelectAdultPassenger {
    static readonly type = "[hotel_passenger] SelectAdultPassenger";
    constructor(public pax: hotelpassenger) {

    }
}

export class DeSelectAdultPassenger {
    static readonly type = "[hotel_passenger] DeSelectAdultPassenger";
    constructor(public pax: hotelpassenger) {

    }
}

export class AddChildPassenger {
    static readonly type = "[hotel_passenger] AddChildPassenger";
    constructor(public pass: hotelpassenger) {

    }
}

export class EditChildPassenger {
    static readonly type = "[hotel_passenger] EditChildPassenger";
    constructor(public pass: hotelpassenger, public pax: hotelpassenger) {

    }
}


export class DeleteChildPassenger {
    static readonly type = "[hotel_passenger] DeleteChildPassenger";
    constructor(public pax: hotelpassenger) {

    }
}

export class SelectChildPassenger {
    static readonly type = "[hotel_passenger] SelectChildPassenger";
    constructor(public pax: hotelpassenger) {

    }
}

export class DeSelectChildPassenger {
    static readonly type = "[hotel_passenger] DeSelectChildPassenger";
    constructor(public pax: hotelpassenger) {

    }
}

export class DismissHotelPassenger {
    static readonly type = "[hotel_passenger] DismissHotelPassenger";

}

export class AddEmployee {
    static readonly type = "[hotel_passenger] AddEmployee";
    constructor(public user: user) {

    }
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
        public modalCtrl: ModalController,
        public popCtrl: PopoverController,
        public store : Store
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

        this.modalCtrl.dismiss(null, null, 'guest-details');
    }

    @Action(AddChildPassenger)
    addChildren(states: StateContext<hotelpassengerstate>, action: AddChildPassenger) {
        let currentAdult = Object.assign([], states.getState().children);
        currentAdult.push(action.pass);

        states.patchState({
            children: currentAdult
        });

        this.modalCtrl.dismiss(null, null, 'guest-details');
    }

    @Action(EditAdultPassenger)
    editAdult(states: StateContext<hotelpassengerstate>, action: EditAdultPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().adult);
        let filterPass: hotelpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o,action.pax)
        });
        filterPass.push(action.pass);

        states.patchState({
            adult: filterPass
        });

        this.modalCtrl.dismiss(null, null, 'guest-details');
    }

    @Action(EditChildPassenger)
    editChild(states: StateContext<hotelpassengerstate>, action: EditChildPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().children);
        let filterPass: hotelpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });
        filterPass.push(action.pass);

        states.patchState({
            children: filterPass
        });

        this.modalCtrl.dismiss(null, null, 'guest-details');
    }

    @Action(DeleteAdultPassenger)
    deleteAdult(states: StateContext<hotelpassengerstate>, action: DeleteAdultPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().adult);
        let filterPass: hotelpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });

        states.patchState({
            adult: filterPass
        });
    }

    @Action(DeleteChildPassenger)
    deleteChild(states: StateContext<hotelpassengerstate>, action: DeleteChildPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().children);
        let filterPass: hotelpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });

        states.patchState({
            children: filterPass
        });
    }

    @Action(SelectAdultPassenger)
    selectAdult(states: StateContext<hotelpassengerstate>, action: SelectAdultPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().adult);
        let pass: hotelpassenger = _.find(passengers, (o) => {
            return _.isEqual(o, action.pax)
        });
        let selected: hotelpassenger[] = Object.assign([], states.getState().selectedAdult);
        selected.push(pass);

        states.patchState({
            selectedAdult: selected
        });
    }

    @Action(DeSelectAdultPassenger)
    deSelectAdult(states: StateContext<hotelpassengerstate>, action: DeSelectAdultPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().selectedAdult);
        let filterPass: hotelpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });

        states.patchState({
            selectedAdult: filterPass
        });
    }

    @Action(SelectChildPassenger)
    selectChild(states: StateContext<hotelpassengerstate>, action: SelectChildPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().children);
        let pass: hotelpassenger = _.find(passengers, (o) => {
            return _.isEqual(o, action.pax)
        });
        let selected: hotelpassenger[] = Object.assign([], states.getState().selectedChildren);
        selected.push(pass);

        states.patchState({
            selectedChildren: selected
        });
    }

    @Action(DeSelectChildPassenger)
    deSelectChild(states: StateContext<hotelpassengerstate>, action: DeSelectChildPassenger) {
        let passengers: hotelpassenger[] = Object.assign([], states.getState().selectedChildren);
        let filterPass: hotelpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });

        states.patchState({
            selectedChildren: filterPass
        });
    }



    @Action(DismissHotelPassenger)
    dismissHotelPassenger(states: StateContext<hotelpassengerstate>) {
        return from(this.modalCtrl.dismiss(null, null,'passenger-list'));
    }

    @Action(AddEmployee)
    addEmployee(states: StateContext<hotelpassengerstate>, action: AddEmployee) {

        let currentAdult = Object.assign([], states.getState().adult);
        let passname = currentAdult.reduce((acc, cur) => [...acc, cur.FirstName], []);
        if (!passname.includes(action.user.name)) {
            let adult: hotelpassenger = {
                PaxType: 2,
                LeadPassenger: false,
                count: 0,
                FirstName: action.user.name,
                LastName: action.user.lastname
            }
    
            currentAdult.push(adult);
    
            states.patchState({
                adult: currentAdult
            });
    
            this.popCtrl.dismiss(null, null, 'employee-list');
        }

    }

}