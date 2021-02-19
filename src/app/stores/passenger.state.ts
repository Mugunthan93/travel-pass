import { Action, NgxsOnChanges, NgxsSimpleChange, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

export interface pass {
    check : boolean
}

export class CheckPassenger {
    static readonly type = '[passenger] CheckPassenger';
}

@State<pass>({
    name: 'passenger',
    defaults: {
        check : false
    },
    // children : [
    //   FlightPassengerState,
    //   HotelPassengerState,
    //   BusPassengerState,
    //   TrainPassengerState
    // ]
})

@Injectable()
export class PassengerState implements NgxsOnChanges {

    constructor() {

    }

    ngxsOnChanges(change: NgxsSimpleChange<any>): void {
        console.log(change);
    }

    @Selector()
    static getCheckPassenger(state : pass) {
        return state.check;
    }

    @Action(CheckPassenger)
    checkpass(states : StateContext<pass>) {
        states.patchState({
            check : true
        });
    }

}
