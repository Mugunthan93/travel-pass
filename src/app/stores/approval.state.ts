import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import * as _ from 'lodash';
import { concat, forkJoin, from, iif, of } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';
import { ApprovalService } from '../services/approval/approval.service';
import { HTTPResponse } from '@ionic-native/http/ngx';


export interface Approval {
    type: string
    list: any,
    selectedRequest: any
    loading : boolean
}

export class ApprovalRequest {
    static readonly type = "[approval] ApprovalRequest";
    constructor(public type: string) {

    }
}

export class GetApproveRequest {
    static readonly type = "[approval] GetApproveRequest";
    constructor(public id: number, public modalcomp : any) {

    }
}

export class HandleRequest {
    static readonly type = "[approval] HandleRequest";
    constructor(public status : string) {

    }
}



@State<Approval>({
    name: 'approval',
    defaults: {
        type: 'flight',
        list: [],
        selectedRequest : null,
        loading : true
    }
})
export class ApprovalState {

    constructor(
        private store: Store,
        public menuCtrl: MenuController,
        public flightService: FlightService,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
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

    @Selector()
    static getLoading(state : Approval) : boolean {
        return state.loading;
    }
    
    //getting approve list
    @Action(ApprovalRequest, { cancelUncompleted: true })
    approveRequest(states: StateContext<Approval>, action: ApprovalRequest) {

        states.patchState({
            list : null,
            type : action.type,
            loading : true
        });
        states.dispatch([new Navigate(['/', 'home', 'approval-request', action.type, 'request-list'])]); 

        let menuclose$ = from(this.menuCtrl.isOpen('first')).pipe(flatMap(el => iif(() => el,from(this.menuCtrl.close('first')),of(true))));
        const userId: number = this.store.selectSnapshot(UserState.getUserId);        
        let approveReq$ = this.approvalService.getApprovalList(action.type, userId);
        
        return forkJoin(menuclose$)
        .pipe(
            flatMap(
                () => {
                    return forkJoin(approveReq$);
                }
            ),
            map(
                (response) => {
                    console.log(response);
                        let openBooking = JSON.parse(response[0].data);
                        // let partition = _.partition(openBooking, (el) => {
                        //     return  moment({}).isBefore(el.travel_date)
                        // })

                        // partition[0] = partition[0].sort((a,b) => {
                        //     if (moment(b.travel_date).isAfter(a.travel_date)) {
                        //         return -1;
                        //     }
                        //     else if (moment(b.travel_date).isBefore(a.travel_date)) {
                        //         return 1;
                        //     }
                        //     else {
                        //         return 0;
                        //     }
                        // })

                        // let book = partition[0].concat(partition[1]);

                        states.patchState({
                          list: openBooking,
                          type: action.type,
                          loading : false
                        });
                    }
                )
            );
    }

    //getting selected approve req
    @Action(GetApproveRequest)
    getApproveRequest(states: StateContext<Approval>, action: GetApproveRequest) {
        const modal$ = from(this.modalCtrl.create({
            component : action.modalcomp,
            id : 'get-approve-item'
        })).pipe(flatMap(el => from(el.present())));

        let getapprove$ = this.approvalService.getReqTicket(action.id.toString(),states.getState().type);
        return getapprove$.pipe(
            flatMap(
                (response) => {
                    let responsedata = JSON.parse(response.data);
                    states.patchState({
                        selectedRequest: this.getRequest(states.getState().type,responsedata)
                    });
                    return modal$;
                }
            )
        );

        
    }

    @Action(HandleRequest)
    handleRequest(states: StateContext<Approval>, action: HandleRequest) {

        const successAlert$ = from(this.alertCtrl.create({
            header: 'Approve Success',
            subHeader: 'Request has been approved successfully',
            buttons: [{
                text: 'OK',
                handler: () => {
                    return concat(
                        from(this.modalCtrl.dismiss('get-approve-item')),
                        states.dispatch(new ApprovalRequest(states.getState().type))
                    );
                }
            }]
        })).pipe(flatMap(el => from(el.present())));
        let failedAlert$ = from(this.alertCtrl.create({
            header: 'Approve Failed',
            subHeader: 'Failed to Approve the Request',
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    states.dispatch(new ApprovalRequest(states.getState().type));
                }
            }]
        }));


        let req = null;

        let reqbody = Object.assign({}, states.getState().selectedRequest);
        reqbody.status = action.status;
        if(states.getState().type == 'bus') {
            reqbody.req_id = reqbody.id;
            reqbody = _.omit(reqbody,['cancellation_charges','cancellation_remarks','createdAt','id','reschedule_remarks','updatedAt']);
        }

        console.log(JSON.stringify(reqbody));

        let id = this.getId(states.getState().type,reqbody);

        let approveReq$ = this.approvalService.approvalReq(states.getState().type,id, reqbody); 
        
        return approveReq$.pipe(
            flatMap(
                (response) => {
                    if (response.status == 200) {
                        return successAlert$;
                    }
                }
            ),
            catchError(
                (error : HTTPResponse) => {
                console.log(error);
                let errObj = null;
                if(error.error) {
                    errObj = JSON.parse(error.error);
                }
                if (errObj.status_code == 500) {
                    return failedAlert$.pipe(
                        flatMap(
                            (el) => {
                                el.message = errObj.message;
                                return from(el.present());
                            }
                        )
                    );
                }
            })
        );
    }

    getRequest(type,data) {
        switch(type) {
            case 'flight' : return data.data[0];
            case 'hotel' : return data[0];
            case 'bus' : return data[0];
        }
    }

    getId(type,req) {
        switch(type) {
            case 'flight' : return req.id;
            case 'hotel' : return req.id;
            case 'bus' : return req.req_id;
        }
    }


}