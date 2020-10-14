import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import * as _ from 'lodash';
import { forkJoin, from, iif, of, throwError } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';
import { ApprovalService } from '../services/approval/approval.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { ApproveRequestComponent } from '../components/shared/approve-request/approve-request.component';


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

export class HandleRequest {
    static readonly type = "[approval] HandleRequest";
    constructor(public status : string) {

    }
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
    
    //getting approve list
    @Action(ApprovalRequest)
    approveRequest(states: StateContext<Approval>, action: ApprovalRequest) {

        states.patchState({
            list : null,
            type : action.type
        });
        states.dispatch([new Navigate(['/', 'home', 'approval-request', action.type, 'request-list'])]); 

        let menuclose$ = from(this.menuCtrl.isOpen('first')).pipe(flatMap(el => iif(() => el,from(this.menuCtrl.close('first')),of(true))));
        const userId: number = this.store.selectSnapshot(UserState.getUserId);        
        let approveReq$ = this.approvalService.getApprovalList(action.type, userId);
        
        return forkJoin(menuclose$)
        .pipe(
            flatMap(
                (response) => {
                    return forkJoin(approveReq$);
                }
            ),
            map(
                (response) => {
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
                        });
                    }
                )
            );
    }

    //getting selected approve req
    @Action(GetApproveRequest)
    getApproveRequest(states: StateContext<Approval>, action: GetApproveRequest) {
        const modal$ = from(this.modalCtrl.create({
            component : ApproveRequestComponent,
            id : 'get-approve-item'
        })).pipe(flatMap(el => from(el.present())));

        let getapprove$ = this.approvalService.getReqTicket(action.id.toString(),states.getState().type);
        return getapprove$.pipe(
            flatMap(
                (response) => {
                    let responsedata = JSON.parse(response.data);

                    states.patchState({
                        selectedRequest: responsedata.data[0]
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
                    states.dispatch(new ApprovalRequest(states.getState().type));
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

        let reqbody = Object.assign({}, states.getState().selectedRequest);
        reqbody.status = action.status;

        let approveReq$ = this.approvalService.approvalReq(states.getState().type,reqbody.id, reqbody); 
        
        return forkJoin(approveReq$,successAlert$,failedAlert$).pipe(
            flatMap(
                (response) => {
                    if (response[0].status == 200) {
                        return from(successAlert$);
                    }
                }
            ),
            catchError(
                (error : HTTPResponse) => {
                let errObj = JSON.parse(error.error);
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


}