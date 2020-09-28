import { State, Action, StateContext } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';


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

export class TrainPassengerState {

    constructor(
        public modalCtrl : ModalController
    ) {

    }

    @Action(AddTrainPassenger)
    addTrainPassenger(states: StateContext<trainpassengerstate>, action: AddTrainPassenger) {
        let currentPass = Object.assign([], states.getState().passenger);
        currentPass.push(action.pass);

        states.patchState({
            passenger: currentPass
        });

        // this.modalCtrl.dismiss(null, null, 'guest-details');
    }

    @Action(EditTrainPassenger)
    editTrainPssenger(states: StateContext<trainpassengerstate>, action: EditTrainPassenger) {
        let passengers: trainpassenger[] = Object.assign([], states.getState().passenger);
        let filterPass: trainpassenger[] = _.filter(passengers, (o) => {
            return !_.isEqual(o, action.pax)
        });
        filterPass.push(action.pass);

        states.patchState({
            passenger: filterPass
        });

        // this.modalCtrl.dismiss(null, null, 'guest-details');
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


}