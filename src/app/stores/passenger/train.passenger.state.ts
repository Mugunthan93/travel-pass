import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ModalController, AlertController } from '@ionic/angular';
import * as _ from 'lodash';
import { from, Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';


export interface trainpassengerstate {
    passenger: trainpassenger[]
    selected: trainpassenger[]
}



export interface trainpassenger {
    primary: boolean
    email: string
    name: string,
    lastName: string,
    Address: string,
    mobile: string,
    idType: string,
    idNumber: string,
    title: string,
    sex: string,
    age: string,
    pax_type: string,
    prefSeat: string
}

export class AddTrainPassenger {
    static readonly type = "[train_passenger] AddTrainPassenger";
    constructor(public pass: trainpassenger) {

    }
}

export class EditTrainPassenger {
    static readonly type = "[train_passenger] EditTrainPassenger";
    constructor(public pass: trainpassenger, public pax: trainpassenger) {

    }
}

export class DeleteTrainPassenger {
    static readonly type = "[train_passenger] DeleteTrainPassenger";
    constructor(public pass: trainpassenger) {

    }
}

export class SelectTrainPassenger {
    static readonly type = "[train_passenger] SelectTrainPassenger";
    constructor(public pass: trainpassenger) {

    }
}

export class DeselectTrainPassenger {
    static readonly type = "[train_passenger] DeselectTrainPassenger";
    constructor(public pass: trainpassenger) {

    }
}

export class DismissTrainPassenger {
    static readonly type = "[train_passenger] DismissTrainPassenger";
}

@State<trainpassengerstate>({
    name: 'train_passenger',
    defaults: {
        passenger: [],
        selected: []
    }
})

@Injectable()
export class TrainPassengerState {

    constructor(
        public modalCtrl: ModalController,
        public alertCtrl: AlertController
    ) {

    }

    @Selector()
    static getPassenger(state : trainpassengerstate) {
        return state.passenger;
    }

    @Selector()
    static getPassCount(state: trainpassengerstate) {
        return state.passenger.length;
    }

    @Selector()
    static getSelectPassenger(state: trainpassengerstate) {
        return state.selected;
    }

    @Selector()
    static getSelectedPassCount(state: trainpassengerstate) {
        return state.passenger.length;
    }

    @Action(AddTrainPassenger)
    addTrainPassenger(states: StateContext<trainpassengerstate>, action: AddTrainPassenger) {
        let currentPass : trainpassenger[] = Object.assign([], states.getState().passenger);
        let trainPass : trainpassenger = {
            primary: action.pass.primary ? true : false,
            email: action.pass.email,
            name: action.pass.name,
            lastName: action.pass.lastName,
            Address: action.pass.Address,
            mobile: action.pass.mobile,
            idType: action.pass.idType,
            idNumber: action.pass.idNumber,
            title: action.pass.title,
            sex: action.pass.sex,
            age: action.pass.age,
            pax_type: action.pass.pax_type,
            prefSeat: action.pass.prefSeat
        }
        currentPass.push(trainPass);

        states.patchState({
            passenger: currentPass
        });

        this.modalCtrl.dismiss(null, null, 'traveller-details');
    }

    @Action(EditTrainPassenger)
    editTrainPassenger(states: StateContext<trainpassengerstate>, action: EditTrainPassenger) {
        let passengers: trainpassenger[] = Object.assign([], states.getState().passenger);
        let filterPass: trainpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });

        let trainPass : trainpassenger = {
            primary: action.pax.primary,
            email: action.pass.email,
            name: action.pass.name,
            lastName: action.pass.lastName,
            Address: action.pass.Address,
            mobile: action.pass.mobile,
            idType: action.pass.idType,
            idNumber: action.pass.idNumber,
            title: action.pass.title,
            sex: action.pass.sex,
            age: action.pass.age,
            pax_type: action.pax.pax_type,
            prefSeat: action.pass.prefSeat
        }

        filterPass.push(trainPass);

        states.patchState({
            passenger: filterPass
        });

        this.modalCtrl.dismiss(null, null, 'traveller-details');
    }

    @Action(DeleteTrainPassenger)
    deleteTrainPassenger(states: StateContext<trainpassengerstate>, action: DeleteTrainPassenger) {
        let passengers: trainpassenger[] = Object.assign([], states.getState().passenger);
        let filterPass: trainpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pass)
        });

        states.patchState({
            passenger: filterPass
        });
    }

    @Action(SelectTrainPassenger)
    selectTrainPassenger(states: StateContext<trainpassengerstate>, action: SelectTrainPassenger) {
        let passengers: trainpassenger[] = Object.assign([], states.getState().passenger);
        let pass: trainpassenger = _.find(passengers, (o) => {
            return _.isEqual(o, action.pass)
        });
        let selected: trainpassenger[] = Object.assign([], states.getState().selected);
        selected.push(pass);

        states.patchState({
            selected: selected
        });
    }

    @Action(DeselectTrainPassenger)
    deselectTrainpassenger(states: StateContext<trainpassengerstate>, action: DeselectTrainPassenger) {
        let passengers: trainpassenger[] = Object.assign([], states.getState().passenger);
        let filterPass: trainpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pass)
        });

        states.patchState({
            selected: filterPass
        });
    }

    @Action(DismissTrainPassenger)
    dismissTrainPassenger(states: StateContext<trainpassengerstate>) {

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

        let selected: trainpassenger[] = states.getState().selected;
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
