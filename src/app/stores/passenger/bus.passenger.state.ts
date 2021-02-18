import { Injectable } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import * as _ from 'lodash';
import { from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { seat } from '../result/bus.state';

export interface buspassengerstate{
    travellerList: buspassenger[]
    selected: buspassenger[]
}


export interface buspassenger {
    primary: boolean,
    email: string,
    name: string,
    lastName: string,
    Address: string,
    mobile: string,
    idType: string,
    idNumber: string,
    title: string,
    sex: string,
    age: string,
    seatNbr: any,
    fare: number,
    serviceTaxAmount: number,
    operatorServiceChargeAbsolute: number,
    totalFareWithTaxes: number,
    ladiesSeat: boolean,
    nameOnId: string,
    ac: boolean,
    sleeper: boolean,
    prefSeat: string
}

export class AddBusPassenger {
    static readonly type = "[bus_passenger] AddBusPassenger";
    constructor(public pass: buspassenger | any) {

    }
}

export class EditBusPassenger {
    static readonly type = "[bus_passenger] EditBusPassenger";
    constructor(public pass: buspassenger | any, public pax: buspassenger) {

    }
}

export class DeleteBusPassenger {
    static readonly type = "[bus_passenger] DeleteBusPassenger";
    constructor(public pass: buspassenger) {

    }
}

export class SelectBusPassenger {
    static readonly type = "[train_passenger] SelectBusPassenger";
    constructor(public pass: buspassenger) {

    }
}

export class DeselectBusPassenger {
    static readonly type = "[bus_passenger] DeselectBusPassenger";
    constructor(public pass: buspassenger) {

    }
}

export class DismissBusPassenger {
    static readonly type = "[bus_passenger] DismissBusPassenger";
}

@State<buspassengerstate>({
    name: 'bus_passenger',
    defaults: {
        travellerList: [],
        selected : []
    }
})

@Injectable()
export class BusPassengerState {

    constructor(
        public modalCtrl: ModalController,
        public alertCtrl: AlertController
    ) {

    }

    @Selector()
    static getPassenger(state : buspassengerstate) {
        return state.travellerList;
    }

    @Selector()
    static getPassCount(state: buspassengerstate) {
        return state.travellerList.length;
    }

    @Selector()
    static getSelectPassenger(state: buspassengerstate) {
        return state.selected;
    }

    @Selector()
    static getSelectedPassCount(state: buspassengerstate) {
        return state.selected.length;
    }

    @Action(AddBusPassenger)
    addBusPassenger(states: StateContext<buspassengerstate>, action: AddBusPassenger) {
        let currentPass : buspassenger[] = Object.assign([], states.getState().travellerList);
        let seat : seat = action.pass.prefSeat;

        let trainPass : buspassenger = {
            title: action.pass.title,
            name: action.pass.name,
            lastName: action.pass.lastName,
            age: action.pass.age,
            prefSeat: seat.id,
            email: action.pass.email,
            mobile: action.pass.mobile,
            idType: action.pass.idType,
            idNumber: action.pass.idNumber,

            Address: action.pass.Address,
            primary: action.pass.primary ? true : false,
            sex: action.pass.title == 'Mr' ? 'M' : 'F' ,

            seatNbr: null,
            fare: seat.fare,
            serviceTaxAmount: seat.serviceTaxAmount,
            operatorServiceChargeAbsolute: seat.operatorServiceChargeAbsolute,
            totalFareWithTaxes: seat.totalFareWithTaxes,
            ladiesSeat: seat.ladiesSeat,
            nameOnId: action.pass.name,
            ac: seat.ac,
            sleeper: seat.sleeper
        }

        currentPass.push(trainPass);

        states.patchState({
            travellerList: currentPass
        });

        this.modalCtrl.dismiss(null, null, 'bus-details');
    }

    @Action(EditBusPassenger)
    editBusPassenger(states: StateContext<buspassengerstate>, action: EditBusPassenger) {
        let passengers: buspassenger[] = Object.assign([], states.getState().travellerList);
        let filterPass: buspassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });

        let seat : seat = action.pass.prefSeat;

        let trainPass : buspassenger = {
            title: action.pass.title,
            name: action.pass.name,
            lastName: action.pass.lastName,
            age: action.pass.age,
            prefSeat: seat.id,
            email: action.pass.email,
            mobile: action.pass.mobile,
            idType: action.pass.idType,
            idNumber: action.pass.idNumber,

            Address: action.pass.Address,
            primary: action.pax.primary,
            sex: action.pass.title == 'Mr' ? 'M' : 'F' ,

            seatNbr: null,
            fare: seat.fare,
            serviceTaxAmount: seat.serviceTaxAmount,
            operatorServiceChargeAbsolute: seat.operatorServiceChargeAbsolute,
            totalFareWithTaxes: seat.totalFareWithTaxes,
            ladiesSeat: seat.ladiesSeat,
            nameOnId: action.pass.name,
            ac: seat.ac,
            sleeper: seat.sleeper
        }

        filterPass.push(trainPass);

        states.patchState({
            travellerList: filterPass
        });

        this.modalCtrl.dismiss(null, null,'bus-details');
    }

    @Action(DeleteBusPassenger)
    deleteBusPassenger(states: StateContext<buspassengerstate>, action: DeleteBusPassenger) {
        let passengers: buspassenger[] = Object.assign([], states.getState().travellerList);
        let filterPass: buspassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pass)
        });

        states.patchState({
            travellerList: filterPass
        });
    }

    @Action(SelectBusPassenger)
    selectBusPassenger(states: StateContext<buspassengerstate>, action: SelectBusPassenger) {
        let passengers: buspassenger[] = Object.assign([], states.getState().travellerList);
        let pass: buspassenger = _.find(passengers, (o) => {
            return _.isEqual(o, action.pass)
        });
        let selected: buspassenger[] = Object.assign([], states.getState().selected);
        selected.push(pass);

        states.patchState({
            selected: selected
        });
    }

    @Action(DeselectBusPassenger)
    deselectBuspassenger(states: StateContext<buspassengerstate>, action: DeselectBusPassenger) {
        let passengers: buspassenger[] = Object.assign([], states.getState().travellerList);
        let filterPass: buspassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pass)
        });

        states.patchState({
            selected: filterPass
        });
    }

    @Action(DismissBusPassenger)
    dismissBusPassenger(states: StateContext<buspassengerstate>) {

        let least$ = from(this.alertCtrl.create({
            header: 'Passenger Required',
            subHeader: 'Minimum One Passenger Required',
            id: 'passenger-check',
            buttons: [{
                text: "Ok",
                handler: () => {
                    return true;
                }
            }]
        })).pipe(
            flatMap(
                (missingEl) => {
                    return from(missingEl.present());
                }
            )
        );

        let lead$ = from(this.alertCtrl.create({
            header: 'Lead Passenger Required',
            subHeader: 'Lead Passenger is Required',
            id: 'lead-check',
            buttons: [{
                text: "Ok",
                handler: () => {
                    return true;
                }
            }]
        })).pipe(
            flatMap(
                (missingEl) => {
                    return from(missingEl.present());
                }
            )
        );

        let selected: buspassenger[] = states.getState().selected;
        if (selected.length < 1) {
            return least$;
        }
        else {
            if (selected.some(el => el.primary == true)) {
                return from(this.modalCtrl.dismiss(null, null, 'passenger-info'));
            }
            else {
                return lead$;
            }
        }
    }

}
