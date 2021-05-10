import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import * as _ from 'lodash';
import { combineLatest, forkJoin, from, iif, of } from 'rxjs';
import { map, flatMap, catchError, mergeMap, skipWhile, concatMap, toArray } from 'rxjs/operators';
import { ApprovalService } from '../services/approval/approval.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import * as moment from 'moment';
import { append, insertItem, patch, removeItem } from "@ngxs/store/operators";
import { Injectable } from "@angular/core";


export interface Approval {
    type: string
    list: any
    selectedRequest: any
    loading : boolean
    pending : any[]
    approved : any[]
    tripstatus : string
    otherapproved : any[]
}

export class ApprovalRequest {
    static readonly type = "[approval] ApprovalRequest";
    constructor(public type: string) {

    }
}

export class AllApprovalRequest {
    static readonly type = "[approval] ALlApprovalRequest";
    constructor() {

    }
}

export class AllOtherRequest {
  static readonly type = "[approval] AllOtherRequest";
}

export class SetTripStatus {
    static readonly type = "[approval] SetTripStatus";
    constructor(public status : string) {

    }
}

export class GetApproveRequest {
    static readonly type = "[approval] GetApproveRequest";
    constructor(public id: number, public type : string, public modalcomp : any) {

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
        loading : true,
        pending : [],
        approved : [],
        otherapproved : [],
        tripstatus : 'pending'
    }
})

@Injectable()
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

    @Selector()
    static getpending(state : Approval) : any[] {
        return state.pending;
    }

    @Selector()
    static getApproved(state : Approval) : any[] {
        return state.approved;
    }

    @Selector()
    static getStatus(state : Approval) : string {
        return state.tripstatus;
    }

    @Selector()
    static getActiveApproval(state : Approval) : number {
        return state.pending.reduce(
            (acc) => {
              if(acc.status === 'pending') {
                return acc + 1;
              }
              return acc;
            },0
          );
    }

    @Selector()
    static getOtherRequest(state : Approval) : any[] {
      return state.otherapproved;
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

        return forkJoin([menuclose$])
        .pipe(
            flatMap(
                () => {
                    return forkJoin([approveReq$]);
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

    @Action(AllApprovalRequest,{ cancelUncompleted : true })
    myAllApproval(states: StateContext<Approval>, action: AllApprovalRequest) {

        states.patchState({
            pending : [],
            approved : [],
            loading : true
        });
        console.log(action);


        let type$ = from(['flight','hotel','bus','train']);
        const userId: number = this.store.selectSnapshot(UserState.getUserId);
        return type$
        .pipe(
            mergeMap(
            (type) => {
                return this.approvalService.getApprovalList(type,userId)
                .pipe(
                    skipWhile(res => res.status !== 200),
                    map(
                        (response : HTTPResponse) => {
                            let book : any[] = _.isUndefined(JSON.parse(response.data)) ? [] : JSON.parse(response.data);
                            let trip : any[] = this.tripResponse(book);
                            states.setState(patch({
                                pending : append(trip.filter(el => el.status == 'pending')),
                                approved : append(trip.filter(el => el.status == 'open')),
                                loading : false
                            }));
                        }
                    )
                )}
            )
        )

    }

    @Action(AllOtherRequest,{ cancelUncompleted : true })
    myOtherApproval(states: StateContext<Approval>) {

      states.patchState({
        otherapproved : [],
        loading : true
      });

        let type$ = from(['flight','hotel','bus','train']);
        const userId: string = this.store.selectSnapshot(UserState.getUserId).toString();
        return type$
        .pipe(
            mergeMap(
            (type) => {
              let openBooking$ = this.approvalService.getOtherList(type, userId, 'open');
              let cancellationpending$ = this.approvalService.getOtherList(type, userId, 'cancellation%20request');
              let reschedulepending$ = this.approvalService.getOtherList(type, userId, 'reschedule_request');

              let bookedBooking$ = this.approvalService.getOtherList(type, userId, 'booked');
              let cancelled$ = this.approvalService.getOtherList(type, userId, 'cancelled');
              let rescheduled$ = this.approvalService.getOtherList(type, userId, 'rescheduled');

              return combineLatest([openBooking$, cancellationpending$, reschedulepending$, bookedBooking$, cancelled$, rescheduled$])
                .pipe(
                  flatMap(
                    (el) => {
                      return from(el)
                        .pipe(
                          concatMap(
                            (e) => {
                              let book : any[] = _.isUndefined(JSON.parse(e.data).data) ? [] : JSON.parse(e.data).data;
                              let trip = this.tripResponse(book);
                              return of(trip)
                            }
                          ),
                          toArray()
                        );
                  }),
                  map(
                    (response) => {
                      let alltrip = _.flattenDeep(response);
                      states.patchState({
                        otherapproved : alltrip,
                        loading : false
                      });
                    }
                  )
              );
              }
            )
        )

    }

    @Action(SetTripStatus,{ cancelUncompleted : true })
    setTripStatus(states: StateContext<Approval>, action: SetTripStatus) {
          states.patchState({
            tripstatus : action.status
          });
    }

    //getting selected approve req
    @Action(GetApproveRequest)
    getApproveRequest(states: StateContext<Approval>, action: GetApproveRequest) {

        if(states.getState().tripstatus == 'pending') {
            const modal$ = from(this.modalCtrl.create({
                component : action.modalcomp,
                id : 'get-approve-item'
            })).pipe(flatMap(el => from(el.present())));

            let getapprove$ = this.approvalService.getReqTicket(action.id.toString(),action.type);
            return getapprove$.pipe(
                flatMap(
                    (response) => {
                        console.log(response);
                        let responsedata = JSON.parse(response.data);
                        states.patchState({
                            selectedRequest: this.getRequest(action.type,responsedata),
                            type : action.type
                        });
                        return modal$;
                    }
                )
            );
        }



    }

    @Action(HandleRequest)
    handleRequest(states: StateContext<Approval>, action: HandleRequest) {

        let reqStatus : string = null;
        if(action.status == 'rej') {
            reqStatus = 'Decline'
        }
        else if(action.status == 'open') {
            reqStatus = 'Approve';
        }

        const successAlert$ = (response) => from(this.alertCtrl.create({
            header: reqStatus + ' Success',
            subHeader: 'Request has been ' + reqStatus.toLowerCase() + ' successfully',
            buttons: [{
                text: 'OK',
                handler: () => {
                    states.setState(patch({
                        pending : removeItem((req : any) => req.id === states.getState().selectedRequest.id),
                        approved : insertItem(this.tripResponse([response])[0])
                    }));
                    this.modalCtrl.dismiss('get-approve-item');
                }
            }]
        })).pipe(flatMap(el => from(el.present())));
        let failedAlert$ = from(this.alertCtrl.create({
            header: reqStatus + ' Failed',
            subHeader: 'Failed to ' + reqStatus.toLowerCase() + ' the Request',
            id : 'failed',
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    this.alertCtrl.dismiss(null,null,'failed');
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
        else if(states.getState().type == 'train') {
            reqbody.req_id = reqbody.id;
        }
        console.log(JSON.stringify(reqbody));
        let id = this.getId(states.getState().type,reqbody);
        let approveReq$ = this.approvalService.approvalReq(states.getState().type,id, reqbody);

        return approveReq$.pipe(
            flatMap(
                (response) => {
                    let data = JSON.parse(response.data).data;
                    console.log(response);
                    if (response.status == 200) {
                        return successAlert$(data);
                    }
                    return of(response);
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
            case 'train' : return data[0];
        }
    }

    getId(type,req) {
        switch(type) {
            case 'flight' : return req.id;
            case 'hotel' : return req.id;
            case 'bus' : return req.req_id;
            case 'train' : req.id;
        }
    }

    bookingData(data : HTTPResponse[]) {
        return data.map(
            (el) => {
                return _.isUndefined(JSON.parse(el.data).data) ? [] : JSON.parse(el.data).data;
            }
        );
    }

    tripResponse(data: any[]) : any[] {
        console.log(data);
        let approvaltrip = data
        .map((trip) => {
            if(trip.hasOwnProperty('trip_requests')) {

                let segments =  _.chain(trip.passenger_details.flight_details).map(el => el.Segments).flattenDeep().compact().value();
                let source = segments[0].Origin.Airport.CityName;
                let destination = _.last(segments).Destination.Airport.CityName;
                let sourcedate = moment(segments[0].Origin.DepTime).utc().format('hh:mm A');
                let destinationdate = moment(_.last(segments).Destination.ArrTime).utc().format('hh:mm A');

                return {
                    id : trip.id,
                    type : 'flight',
                    source : source,
                    destination : destination,
                    startdate : sourcedate,
                    enddate : destinationdate,
                    traveldate : new Date(trip.passenger_details.flight_details[0].Segments[0][0].Origin.DepTime),
                    journey : trip.trip_requests.JourneyType,
                    status : trip.status
                };
            }
            else if(trip.hasOwnProperty('hotel_requests')) {
              return {
                id : trip.id,
                source : trip.guest_details.basiscInfo.HotelName,
                destination : trip.guest_details.basiscInfo.CityName,
                startdate : trip.guest_details.basiscInfo.CheckInDate,
                enddate : trip.guest_details.basiscInfo.CheckOutDate,
                type : 'hotel',
                traveldate : new Date(trip.guest_details.basiscInfo.CheckInDate),
                status : trip.status
              }

            }
            else if(trip.hasOwnProperty('bus_requests')) {
                if(trip.passenger_details.selectedbus) {
                    return {
                      id : trip.id,
                      source : trip.passenger_details.selectedbus[0].operatorName,
                      destination : trip.passenger_details.selectedbus[0].busType,
                      startdate : trip.passenger_details.selectedbus[0].departureTime,
                      enddate :trip.passenger_details.selectedbus[0].arrivalTime,
                      type : 'bus',
                      traveldate : new Date(trip.bus_requests[0].doj),
                      status : trip.status
                    }
                }
                else {
                    return;
                }
            }
            else if(trip.hasOwnProperty('train_requests')) {
                let lastTrip =  trip.train_requests.Segments.length - 1;
                return {
                  type : 'train',
                  source: trip.train_requests.Segments[0].OriginName,
                  destination: trip.train_requests.Segments[lastTrip].DestinationName,
                  startdate: moment(trip.train_requests.Segments[0].depDate).utc().format('hh:mm A'),
                  enddate : moment(trip.train_requests.Segments[lastTrip].depDate).utc().format('hh:mm A'),
                  id : trip.id,
                  traveldate : new Date(trip.train_requests.Segments[0].depDate),
                  journey : trip.train_requests.JourneyType,
                  status : trip.status
                }
            }
        });
        return approvaltrip
            .filter(el => !_.isUndefined(el))
            .filter(el => moment(el.traveldate).isSameOrAfter({},'date'))
            .filter(el => (el.status == 'pending' || el.status == 'open'));
    }

}

