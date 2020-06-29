import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';


export interface Approval {
    type: string
    list : any
}

export class ApprovalRequest {
    static readonly type = "[approval] ApprovalRequest";
    constructor(public type: string) {

    }
}

@State<Approval>({
    name: 'approval',
    defaults: {
        type: 'flight',
        list: null
    }
})
export class ApprovalState {

    constructor(
        private store: Store,
        public menuCtrl: MenuController,
        public flightService : FlightService
    ) {

    }

    @Selector()
    static getAllBookings(state: Approval): any[] {
        return state.list;
    }

    @Action(ApprovalRequest)
    async approveRequest(states: StateContext<Approval>, action: ApprovalRequest) {
        states.patchState({
            type: action.type
        });

        let allBooking : any[] = [];

        try {
            const userId: number = this.store.selectSnapshot(UserState.getUserId);
            const approvalReqResponse = await this.flightService.approvalReqList(userId);
            console.log(approvalReqResponse);
            let openBooking = JSON.parse(approvalReqResponse.data);
            allBooking.push(...openBooking);

        }
        catch (error) {
            console.log(error);
        }

        states.patchState({
            list : allBooking
        });

        this.menuCtrl.close('first');
        this.store.dispatch(new Navigate(['/', 'home', 'approval-request', states.getState().type, 'request-list']));
    }


}