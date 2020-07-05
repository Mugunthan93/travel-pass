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
            let response = JSON.parse(getApprovalReqResponse.data);
            states.patchState({
                selectedRequest: response.data[0]
            });
            return await modal.present();

        }
        catch (error) {
            console.log(error);
        }

    }

    @Action(AcceptRequest)
    async acceptRequest(states: StateContext<Approval>) {
        let req = Object.assign({}, states.getState().selectedRequest);
        let reqbody = {
            passenger_details: req.passenger_details,
            booking_mode: req.booking_mode,
            assigned_to: req.assigned_to,
            assigned_by: req.assigned_by,
            comments: req.comments,
            trip_requests: req.trip_requests,
            cancellation_remarks: req.cancellation_remarks,
            trip_type: req.trip_type,
            customer_id: req.customer_id,
            status: 'open',
            transaction_id: req.transaction_id,
            managers: req.managers,
            user_id: req.user_id,
            req_id: req.id,
            traveller_id: req.traveller_id,
            travel_date: req.travel_date
        }
        console.log(reqbody);
        console.log(JSON.stringify(reqbody));
        try {
            const acceptReqResponse = await this.flightService.approvalReq(req.id, reqbody);
            console.log(acceptReqResponse);
        }
        catch (error) {
            let errObj = JSON.parse(error.error);
            console.log(errObj);
            console.log(error);
        }
    }

    @Action(DeclineRequest)
    async declineRequest(states: StateContext<Approval>) {
        let req = Object.assign({}, states.getState().selectedRequest);
        let reqbody = {
            passenger_details: req.passenger_details,
            booking_mode: req.booking_mode,
            assigned_to: req.assigned_to,
            assigned_by: req.assigned_by,
            comments: req.comments,
            trip_requests: req.trip_requests,
            cancellation_remarks: req.cancellation_remarks,
            trip_type: req.trip_type,
            customer_id: req.customer_id,
            status: 'rej',
            transaction_id: req.transaction_id,
            managers: req.managers,
            user_id: req.user_id,
            req_id: req.id,
            traveller_id: req.traveller_id,
            travel_date: req.travel_date
        }
        console.log(reqbody);
        console.log(JSON.stringify(reqbody));
        try {
            const acceptReqResponse = await this.flightService.approvalReq(req.id, reqbody);
            console.log(acceptReqResponse);
        }
        catch (error) {
            let errObj = JSON.parse(error.error);
            console.log(errObj);
            console.log(error);
        }
    }


}