import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, ModalController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import { ApproveRequestComponent } from '../components/flight/approve-request/approve-request.component';


export interface Approval {
    type: string
    list: any,
    selectedRequest: any
}

export class ApprovalRequest {
    static readonly type = "[approval] ApprovalRequest";
    constructor(public type: string) {

    }
}

export class GetApproveRequest {
    static readonly type = "[approval] GetApproveRequest";
    constructor(public id: number) {

    }
}

export class AcceptRequest {
    static readonly type = "[approval] AcceptRequest";
}

export class DeclineRequest {
    static readonly type = "[approval] DeclineRequest";
}



@State<Approval>({
    name: 'approval',
    defaults: {
        type: 'flight',
        list: null,
        selectedRequest : null
    }
})
export class ApprovalState {

    constructor(
        private store: Store,
        public menuCtrl: MenuController,
        public flightService: FlightService,
        public modalCtrl: ModalController
    ) {

    }

    @Selector()
    static getAllBookings(state: Approval): any[] {
        return state.list;
    }

    @Selector()
    static getSelectedRequest(state: Approval) {
        return state.selectedRequest;
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

    @Action(GetApproveRequest)
    async getApproveRequest(states: StateContext<Approval>, action: GetApproveRequest) {
        const modal = await this.modalCtrl.create({
            component : ApproveRequestComponent
        });

        try {
            const getApprovalReqResponse = await this.flightService.getReqTicket(action.id.toString());
            console.log(getApprovalReqResponse);
            states.patchState({
                selectedRequest: getApprovalReqResponse.data[0]
            });
            return await modal.present();

        }
        catch (error) {
            console.log(error);
        }

    }

    @Action(AcceptRequest)
    async acceptRequest(states: StateContext<Approval>) {
        let req = null;
        try {
            const acceptReqResponse = await this.flightService.approvalReq(states.getState().selectedRequest.id,req);
            console.log(acceptReqResponse);
        }
        catch (error) {
            console.log(error);
        }
    }

    @Action(DeclineRequest)
    declineRequest(states: StateContext<Approval>, action: DeclineRequest) {

    }


}