import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, ModalController, AlertController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import { ApproveRequestComponent } from '../components/flight/approve-request/approve-request.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApprovalService } from '../services/approval/approval.service';


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
        public modalCtrl: ModalController,
        private alertCtrl : AlertController,
        private approvalService : ApprovalService
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

    @Selector()
    static getType(state : Approval) : string {
        return state.type;
    }
    
    //getting approve list
    @Action(ApprovalRequest)
    async approveRequest(states: StateContext<Approval>, action: ApprovalRequest) {

        states.dispatch(new Navigate(['/', 'home', 'approval-request', states.getState().type, 'request-list']));

        const userId: number = this.store.selectSnapshot(UserState.getUserId);        
        let menuclose$ = this.menuCtrl.isOpen('first');
        let approveReq$ = this.approvalService.getApprovalList(action.type, userId);

        return forkJoin(menuclose$,approveReq$)
            .pipe(
                map(
                    (response) => {
                        let listResponse = response[1];
                        let openBooking = JSON.parse(listResponse.data);
                        let partition = _.partition(openBooking, (el) => {
                            return  moment({}).isBefore(el.travel_date)
                        })
                        partition[0] = partition[0].sort((a,b) => {
                            if (moment(b.travel_date).isAfter(a.travel_date)) {
                                return -1;
                            }
                            else if (moment(b.travel_date).isBefore(a.travel_date)) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        })
                        states.patchState({
                            list: partition[0].concat(partition[1]),
                            type: action.type
                        });

                        if(response[0]) {
                            return from(this.menuCtrl.close('first'));
                        }
                    }
                )
            );
    }

    //getting selected approve req
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

    //accept req
    @Action(AcceptRequest)
    async acceptRequest(states: StateContext<Approval>) {
        const successAlert = await this.alertCtrl.create({
            header: 'Approve Success',
            subHeader: 'Request has been approved successfully',
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.store.dispatch(new ApprovalRequest('flight'));
                    successAlert.dismiss();
                }
            }]
        });
        let failedAlert = await this.alertCtrl.create({
            header: 'Approve Failed',
            subHeader: 'Failed to Approve the Request',
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    successAlert.dismiss();
                }
            }]
        });
        
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
            const acceptReqResponse = await this.approvalService.approvalReq(req.id, reqbody);
            console.log(acceptReqResponse);
            // if (acceptReqResponse.status == 200) {
            //     successAlert.present();
            // }
        }
        catch (error) {
            let errObj = JSON.parse(error.error);
            if (errObj.status_code == 500) {
                failedAlert.message = errObj.message;
                failedAlert.present();
            }
            console.log(errObj);
            console.log(error);
        }
    }

    //decline req
    @Action(DeclineRequest)
    async declineRequest(states: StateContext<Approval>) {

        const successAlert = await this.alertCtrl.create({
            header: 'Decline Success',
            subHeader: 'Request has been Decline successfully',
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.store.dispatch(new ApprovalRequest('flight'));
                    successAlert.dismiss();
                }
            }]
        });
        let failedAlert = await this.alertCtrl.create({
            header: 'Decline Failed',
            subHeader: 'Failed to decline the Request',
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    successAlert.dismiss();
                }
            }]
        });

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
            const declineReqResponse = await this.approvalService.approvalReq(req.id, reqbody);
            console.log(declineReqResponse);
            // if (declineReqResponse.status == 200) {
            //     successAlert.present();
            // }
        }
        catch (error) {
            let errObj = JSON.parse(error.error);
            if (errObj.status_code == 500) {
                failedAlert.message = errObj.message;
                failedAlert.present();
            }
            console.log(errObj);
            console.log(error);
        }
    }


}