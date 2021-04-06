import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { concat, throwError } from 'rxjs';
import { BookingService } from '../services/booking/booking.service';
import { forkJoin, from, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import * as _ from 'lodash';
import { req_segment } from '../components/shared/reschedule/reschedule.component';
import { GetToken, HotelResultState } from './result/hotel.state';
import { ApprovalService } from '../services/approval/approval.service';
import { flightResult } from '../models/search/flight';
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { environment } from "src/environments/environment";
import { AllUpcomingTrips, DashboardState, upcomingTrips } from "./dashboard.state";
import { FlightService } from "../services/flight/flight.service";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import * as moment from "moment";
import { append, patch } from '@ngxs/store/operators';
import { Injectable } from "@angular/core";

export interface booking {
    type: string
    new: any[]
    history: any[]
    reschedule: any
    loading: boolean
    cancel: any
    cancelType : 'full' | 'partial'
    mode : string
    status : string
    allbookings : any[]
    viewBookings : any[]
    tripstatus : string
    currentRequest : any
}

export interface cancel_request {
  Origin: string;
  OriginCode: string;
  DestinationCode: string;
  FlightCabinClass: string;
  PreferredDepartureTime: string;
  PreferredArrivalTime: string;
  Destination: string;
}

export interface cancelled_details {
  data: cancelled_details_data[];
  org_cancel_details: org_cancel_details;
  vendor_onwardInvoiceNum: string;
  vendor_returnInvoiceNum: string;
}

export interface cancelled_details_data {
  B2B2BStatus: boolean;
  TicketCRInfo: ticketCRIInfo[];
  ResponseStatus: number;
  TraceId: string;
}

export interface ticketCRIInfo {
  ChangeRequestId: number;
  TicketId: number;
  Status: number;
  Remarks: string;
  ChangeRequestStatus: number;
}

export interface request_param {
  BookingId: number;
  RequestType: number;
  CancellationType: number;
  Remarks: string;
  EndUserIp: string
  TokenId: string
}

export interface org_cancel_details {
  sector: flightResult[];
  request_param: request_param;
  FullCancellation: number;
}

export interface customer_cancellation_details {
  PNR: string;
  cancellation_penalty_fee: number;
  K3: number;
  K3Return: number;
  Service_charge: number;
  sgst: number;
  cgst: number;
  igst: number;
  Total_Cancellation_Charges: number;
}

export interface vendor_cancellation_details {
  PLB: number;
  total_offered_price: number;
  VendorInvoiceNum: string;
  VendorInvoiceDate: string;
}

////////////////////////////////////////////////

export class MyBooking {
    static readonly type = "[booking] MyBooking";
    constructor(public type : string) {

    }
}

export class MyAllBooking {
  static readonly type = "[booking] MyAllBooking";
}

export class ChangeBookingMode {
    static readonly type = "[booking] ChangeBookingMode";
    constructor(public mode : string) {

    }
}

export class DownloadTicket {
    static readonly type = "[booking] DownloadTicket";
    constructor(public booked : string[]) {

    }
}

export class GetRescheduleTicket {
  static readonly type = "[booking] GetRescheduleTicket";
  constructor(public id : number, public modal : any) {}
}


export class RescheduleTicket {
    static readonly type = "[booking] RescheduleTicket";
    constructor(public sector : req_segment[],public remark : string) {

    }
}

export class GetcancelTicket {
  static readonly type = "[booking] GetcancelTicket";
  constructor(public id: number,public type : string, public modal : any) {}
}

export class CancelTicket {
    static readonly type = "[booking] CancelTicket";
    constructor(public remarks : string) {

    }
}

export class ViewFile {
    static readonly type = "[booking] ViewFile";
    constructor(public pnr : string) {

    }
}

export class SetStatus {
  static readonly type = "[booking] SetStatus";
  constructor(public status : string) {
  }
}

export class SetCancelType {
  static readonly type = "[booking] SetCancelType";
  constructor(public status : 'full' | 'partial') {
  }
}

export class SetType {
  static readonly type = "[booking] SetType";
  constructor(public type : string) {
  }
}

export class SetTripStatus {
  static readonly type = "[booking] SetTripStatus";
  constructor(public status : string) {
  }
}

export class SetCurrentRequest {
  static readonly type = "[booking] SetCurrentRequest";
  constructor(public request : any) {
  }
}

@State<booking>({
  name: "booking",
  defaults: {
    type: "flight",
    new: [],
    history: [],
    loading: true,
    mode : 'online',
    reschedule: null,
    cancel: null,
    cancelType : 'full',
    status : 'open',
    allbookings : [],
    viewBookings : [],
    tripstatus : 'active',
    currentRequest : null
  },
})

@Injectable()
export class BookingState {

  static activeStatus : string[] = ['new','open','pending','rej'];
  static confirmedStatus : string[] = ['booked','rescheduled','cancelled'];
  static completedStatus : string[] = ['booked','rescheduled'];

  constructor(
    private store: Store,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private bookingService: BookingService,
    private file: File,
    private fileOpener: FileOpener,
    private approvalService: ApprovalService,
    public flightService : FlightService,
    public androidPermissions : AndroidPermissions
  ) {}

  @Selector()
  static getCurrentRequest(state : booking) : any {
    return state.currentRequest;
  }

  @Selector()
  static getNewBooking(state: booking): any[] {
    return state.new.filter(
      (arr) => {
        return arr.status == state.status
      }
    );
  }

  @Selector()
  static getHistoryBooking(state: booking): any[] {
    return state.history.filter(
      (arr) => {
        return arr.status == state.status
      }
    );
  }

  @Selector()
  static getType(state: booking): string {
    return state.type;
  }

  @Selector()
  static getLoading(state: booking): boolean {
    return state.loading;
  }

  @Selector()
  static getStatus(state: booking) : string {
    return state.status;
  }

  @Selector()
  static getRescheduleTicket(state: booking): any {
    return state.reschedule;
  }

  @Selector()
  static getCancelTicket(state: booking): any {
    return state.cancel;
  }

  @Selector()
  static getCancelType(state: booking) : 'full' | 'partial' {
    return state.cancelType;
  }

  @Selector()
  static getBookingMode(state : booking) : string {
      return state.mode;
  }

  @Selector()
  static getActiveBooking(state : booking) : number {
    return state.allbookings.reduce(
      (acc) => {
        if(acc.status === 'pending') {
          return acc + 1;
        }
        return acc;
      },0
    );
  }

  @Selector()
  static getAllBookings(state : booking) : any[] {
    switch(state.tripstatus)
    {
      case 'active' : return state.allbookings.filter(el => this.activeStatus.includes(el.status) && moment(el.traveldate).isSameOrAfter({},'date'));
      case 'confirmed' : return state.allbookings.filter(el => this.confirmedStatus.includes(el.status) && moment(el.traveldate).isSameOrAfter({},'date'));
      case 'completed' : return state.allbookings.filter(el => this.completedStatus.includes(el.status) && moment(el.traveldate).isBefore({},'date'));
      default : return state.allbookings;
    }
  }

  @Selector()
  static getViewBookings(state : booking) : any[] {
    return state.viewBookings;
  }

  @Selector()
  static getTripStatus(state : booking) : string {
    return state.tripstatus;
  }

  @Action(SetCurrentRequest)
  setCurrentRequest(states: StateContext<booking>, action: SetCurrentRequest) {
    states.patchState({
      currentRequest : states.getState().viewBookings.find(el => el.id == action.request.id)
    });
  }


  @Action(SetStatus)
  setStatus(states: StateContext<booking>, action: SetStatus) {
    states.patchState({
      status : action.status
    });
  }

  @Action(SetCancelType)
  setCancelType(states: StateContext<booking>, action: SetCancelType) {
    states.patchState({
      cancelType : action.status
    });
  }

  @Action(SetType)
  setType(states: StateContext<booking>, action: SetType) {
    states.patchState({
      type : action.type
    });
  }

  @Action(SetTripStatus)
  setStripStatus(states: StateContext<booking>, action: SetTripStatus) {

    states.patchState({
      allbookings : [],
      loading : true
    });

    states.dispatch(new MyAllBooking());
    states.patchState({
      tripstatus : action.status
    });
  }

  @Action(MyBooking)
  myBooking(states: StateContext<booking>, action: MyBooking) {
        states.patchState({
            new: [],
            history: [],
            type : action.type,
            loading : true
        });

        states.dispatch(new Navigate(['/', 'home', 'my-booking', action.type, 'new']));
        let menuclose$ = from(this.menuCtrl.isOpen('first'));

        return menuclose$
            .pipe(
                flatMap(
                    (isopen) => {
                        if(isopen){
                            return from(this.menuCtrl.close('first'));
                        }
                        else {
                            return of(true);
                        }
                    }
                ),
                flatMap(
                    () => {
                        let mode = states.getState().mode

                        let newBooking$ = this.bookingService.myBooking(action.type,'new',mode);
                        let openBooking$ = this.bookingService.myBooking(action.type,'open',mode);
                        let pendingBooking$ = this.bookingService.myBooking(action.type,'pending',mode);

                        let bookedBooking$ = this.bookingService.myBooking(action.type,'booked',mode);
                        let cancellationpending$ = this.bookingService.myBooking(action.type,'cancellation%20request',mode);
                        let cancelled$ = this.bookingService.myBooking(action.type,'cancelled',mode);
                        let reschedulepending$ = this.bookingService.myBooking(action.type,'reschedule_request',mode);
                        let rescheduled$ = this.bookingService.myBooking(action.type,'rescheduled',mode);

                        let newbooking$ = forkJoin([
                            newBooking$,
                            openBooking$,
                            pendingBooking$,
                            cancellationpending$,
                            reschedulepending$,
                        ]);

                        let historybooking$ = forkJoin([
                            bookedBooking$,
                            cancelled$,
                            rescheduled$
                        ]);

                        return forkJoin([newbooking$,historybooking$]);
                    }
                ),
                flatMap(
                    (response) => {
                        let newResponse = response[0];
                        let historyResponse = response[1];

                        let newArray = _.flatMap(this.bookingData(newResponse));
                        let historyArray = _.flatMap(this.bookingData(historyResponse));

                        states.patchState({
                            new: newArray,
                            history: historyArray,
                            type : action.type,
                            loading : false
                        });

                        return of(true);
                    }
                )
            )
  }

  @Action(MyAllBooking,{ cancelUncompleted : true })
  myAllBooking(states: StateContext<booking>, action: MyAllBooking) {

    states.patchState({
      allbookings : [],
      viewBookings : [],
      loading : true
    });
    console.log(action);


    let type$ = from(['flight','hotel','bus','train','cab']);
    let currentStatus = (status: string) => {
      switch(status) {
        case 'active' : return ['new','open','pending','rej'];
        case 'confirmed' : return ['booked','cancelled','rescheduled'];
        case 'completed' : return ['booked','rescheduled'];
      }
    }
    return type$
      .pipe(
        mergeMap(
          (type) => {
            let status$ = from(currentStatus(states.getState().tripstatus));
            return status$
              .pipe(
                mergeMap(
                  (status) => {
                    let reqType = 'online';
                    if(type == 'train') {
                      reqType = 'offline';
                    }
                    return this.bookingService.myBooking(type,status,reqType)
                      .pipe(
                        map(
                          (response : HTTPResponse) => {
                            let book : any[] = _.isUndefined(JSON.parse(response.data).data) ? [] : JSON.parse(response.data).data;
                            let trip = this.tripResponse(book,states.getState().tripstatus);
                            states.setState(patch({
                              viewBookings : append(book),
                              allbookings : append(trip),
                              loading : false
                            }));

                            console.log(states.getState().allbookings);
                          }
                        )
                      );
                  }
                ),
                catchError(
                  (error) => {
                    if(error.status == -4) {
                      return throwError(error);
                    }
                    return of(error);
                  }
                )
              )
            }
        )
      )

  }

  @Action(ChangeBookingMode)
  changeMode(states: StateContext<booking>, action: ChangeBookingMode) {
      states.patchState({
          new: [],
          history: [],
          mode : action.mode,
          loading : true
      });

      let type = states.getState().type;
      let mode = action.mode;

      let newbooking$ = this.getBooking(mode,type,'new');
      let historybooking$ = this.getBooking(mode,type,'history');

      return forkJoin([newbooking$,historybooking$])
          .pipe(
              flatMap(
                  (response) => {
                      if(response.some(el => el == null)) {
                          states.patchState({
                              new: [],
                              history: [],
                              mode : action.mode,
                              loading : false
                          });

                          return of(true);
                      }
                      else {
                          let newResponse = response[0];
                          let historyResponse = response[1];

                          let newArray = _.flatMap(this.bookingData(newResponse));
                          let historyArray = _.flatMap(this.bookingData(historyResponse));

                          states.patchState({
                              new: newArray,
                              history: historyArray,
                              mode : action.mode,
                              loading : false
                          });

                          return of(true);
                      }
                  }
              )
          );
  }

  @Action(ViewFile)
  viewFile(states : StateContext<booking>, action : ViewFile) {
    const failedAlert$ = (pnr) => from(
      this.alertCtrl.create({
        header: "File Error",
        subHeader: "File Not Found",
        id : 'view-alert',
        buttons: [
          {
            text: "Retry",
            handler: () => {
              return this.store.dispatch(new DownloadTicket(pnr))
                .pipe(
                  tap(() => states.dispatch(new ViewFile(pnr)))
                )
            },
          },
          {
            text: "cancel",
            handler: () => {
              this.alertCtrl.dismiss(null,null,'view-alert');
            }
          }
        ],
      })
    ).pipe(
      flatMap((alert) => {
        return from(alert.present());
      })
    );
    let filepath = (pnr) => this.file.externalRootDirectory +"/TravellersPass/Ticket/" + pnr +".pdf";
    let fileopener$ = (pnr) => from(this.fileOpener.open(filepath(pnr),"application/pdf"));

    let PNR : string[] = JSON.parse(action.pnr);
    return from(PNR)
      .pipe(
        concatMap((pnr) => {
          return fileopener$(pnr)
            .pipe(
              catchError((error) => {
                if (error.status == 9) {
                  return failedAlert$(pnr);
                }
              })
            );
        })
      );
  }

  @Action(DownloadTicket)
  downoadTicket(states : StateContext<booking>, action : DownloadTicket) {

    console.log(states);

    const failedAlert$ = (msg,sub) => from(
      this.alertCtrl.create({
        header: msg,
        subHeader: sub,
        id : 'view-alert',
        buttons: [
          {
            text: "cancel",
            handler: () => {
              this.alertCtrl.dismiss(null,null,'view-alert');
            }
          }
        ],
      })
    ).pipe(
      flatMap((alert) => {
        return from(alert.present());
      })
    );

    let req$ = this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
    let checkPerm$ = this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);

    let transferObject = new FileTransfer().create();
    let url = environment.baseURL + '/ticket/' + action.booked + '.pdf';
    let path = this.file.externalRootDirectory +"TravellersPass/Ticket/" + action.booked +".pdf";
    let transfer$ = from(transferObject.download(url,path));
    return from(checkPerm$)
      .pipe(
        flatMap((has) => {
          if(has.hasPermission) {
            return transfer$;
          }
          else {
            return from(req$).pipe(tap(() => req$))
          }
        }),
        catchError(
          (error) => {
            console.log(error);
            return failedAlert$("Download Failed","Problem downloading the ticket");
          }
        )
      );

  }

  @Action(RescheduleTicket)
  rescheduleTicket(states: StateContext<booking>, action: RescheduleTicket) {
    const successAlert$ = from(
      this.alertCtrl.create({
        header: "Approve Success",
        subHeader: "Reschedule Request has been send successfully",
        buttons: [
          {
            text: "OK",
            handler: () => {
              return concat(states.dispatch(new AllUpcomingTrips()),this.modalCtrl.dismiss(null,null,'reschedule-ticket'));
            },
          },
        ],
      })
    ).pipe(flatMap((el) => from(el.present())));

    let failedAlert$ = from(
      this.alertCtrl.create({
        header: "Approve Failed",
        subHeader: "Failed to Reschedule the Request",
        buttons: [
          {
            text: "Cancel",
            handler: () => {
              return concat(this.modalCtrl.dismiss(null,null,'reschedule-ticket'));
            },
          },
        ],
      })
    );

    states.dispatch(new GetToken());
    let token = this.store.selectSnapshot(HotelResultState.getToken);

    let reschedule = Object.assign({}, states.getState().reschedule);
    let detail = {
      edited_passenger: [],
      request: {
        BookingId: "",
        RequestType: "3",
        CancellationType: 0,
        Remarks: action.remark,
        TicketId: "",
        EndUserIp: "192.168.0.115",
        TokenId: token,
        Sectors: action.sector,
      },
    };
    let passenger = Object.assign({}, reschedule.passenger_details);
    passenger.reschedule_details = Object.assign({}, detail);
    reschedule.passenger_details = passenger;
    reschedule.status = "reschedule_request";
    reschedule.reschedule_remarks = action.remark;

    reschedule.req_id = reschedule.id;

    reschedule = _.omit(reschedule, [
      "approval_mail_cc",
      "cancellation_charges",
      "createdAt",
      "credit_req",
      "extra_service",
      "id",
      "onward_pnr",
      "parent_id",
      "return_pnr",
      "travel_date",
      "traveller_id",
      "updatedAt",
    ]);

    let type = states.getState().type;

    let reqest$ = this.approvalService.approvalReq(
      type,
      reschedule.req_id,
      reschedule
    );

    return reqest$.pipe(
      flatMap((response) => {
        if (response.status == 200) {
          return successAlert$;
        }
      }),
      catchError((error: HTTPResponse) => {
        let errObj = null;
        if (error.error) {
          errObj = JSON.parse(error.error);
        }
        if (errObj.status_code == 500) {
          return failedAlert$.pipe(
            flatMap((el) => {
              el.message = errObj.message;
              return from(el.present());
            })
          );
        }
      })
    );
  }

  @Action(GetRescheduleTicket)
  getrescheduleTicket(states: StateContext<booking>,action: GetRescheduleTicket) {
    const modal$ = from(
      this.modalCtrl.create({
        component: action.modal,
        id: "reschedule-ticket",
      })
    ).pipe(flatMap((el) => from(el.present())));

    let trip = this.store.selectSnapshot(DashboardState.getUpcomingTripsObject)
      .find(el => el.id == action.id);

    states.patchState({
      reschedule: trip
    });

    return modal$;
  }

  @Action(GetcancelTicket)
  getcancelTicket(states: StateContext<booking>, action: GetcancelTicket) {
    const modal$ = from(
      this.modalCtrl.create({
        component: action.modal,
        id: "cancellation-ticket",
      })
    ).pipe(flatMap((el) => from(el.present())));

    let trip = this.store.selectSnapshot(DashboardState.getUpcomingTripsObject)
    .find(el => el.id == action.id);

    states.patchState({
      cancel: trip,
      type : action.type
    });

    return modal$;
  }

  @Action(CancelTicket)
  cancelTicket(states: StateContext<booking>, action : CancelTicket) {

    const successAlert$ = from(
      this.alertCtrl.create({
        header: "Approve Success",
        subHeader: "Cancel Request has been send successfully",
        buttons: [
          {
            text: "OK",
            handler: () => {
              return concat(states.dispatch(new AllUpcomingTrips()),this.modalCtrl.dismiss(null,null,'cancellation-ticket'));
            },
          },
        ],
      })
    ).pipe(flatMap((el) => from(el.present())));

    let failedAlert$ = from(
      this.alertCtrl.create({
        header: "Approve Failed",
        subHeader: "Failed to Cancel the Request",
        buttons: [
          {
            text: "Cancel",
            handler: () => {
              return concat(this.modalCtrl.dismiss(null,null,'reschedule-ticket'));
            },
          },
        ],
      })
    );

    states.dispatch(new GetToken());
    let token = this.store.selectSnapshot(HotelResultState.getToken);
    let cancel = Object.assign({}, states.getState().cancel);
    let bookingId = JSON.parse(cancel.passenger_details.BookingId)[0];
    let remarks = action.remarks;
    let type = states.getState().type;

    let param : request_param = {
      BookingId: bookingId,
      RequestType: 1,
      CancellationType: 0,
      Remarks: remarks,
      EndUserIp: "192.168.0.115",
      TokenId: token
    };

    cancel.status = "cancelled";
    cancel.cancellation_remarks = action.remarks;
    cancel.req_id = cancel.id;

    cancel = _.omit(cancel, [
      "approval_mail_cc",
      "cancellation_charges",
      "createdAt",
      "credit_req",
      "extra_service",
      "id",
      "onward_pnr",
      "parent_id",
      "return_pnr",
      "travel_date",
      "traveller_id",
      "updatedAt",
    ]);

    let email = {
      bccemail: "operations@tripmidas.com",
      mailcontent: "https://demo.travellerspass.com Alert message:-Airline - Online Full Cancel: Credit Note not generated by Supplier end,error log from Company ID:211/Request ID:3421",
      subject: "Urgent !  Online Full Cancel: Credit Note Failed:",
      toemail: "rajkumar@tripmidas.com,mari@tripmidas.com,techteam@tripmidas.com"
    }

    let req$ = this.bookingService.sendChangeRequet(param);
    let cancel$ = this.approvalService.approvalReq(
      type,
      cancel.req_id,
      cancel
    );
    let email$ = this.flightService.emailItinerary(email);
    if(states.getState().cancelType == 'full') {
      return req$
        .pipe(
          flatMap((response) => {
            let changeresponse = JSON.parse(response.data);
            return cancel$;
          }),
          flatMap(() => email$),
          flatMap(() => successAlert$),
          catchError((error: HTTPResponse) => {
            let errObj = null;
            if (error.error) {
              errObj = JSON.parse(error.error);
            }
            if (errObj.status_code == 500) {
              return failedAlert$.pipe(
                flatMap((el) => {
                  el.message = errObj.message;
                  return from(el.present());
                })
              );
            }
          })
        );
    }
    else if(states.getState().cancelType == 'partial') {

    }



      // let vendor_cancellation_details: vendor_cancellation_details = [{
      //     PLB: ticket.passenger_details.uapi_params.selected_plb_Value.PLB_earned,
      //     total_offered_price: ticket.passenger_details.flight_details[0].Fare.OfferedFare,
      //     VendorInvoiceNum: '',
      //     VendorInvoiceDate: ''
      // }];
  }

  getBooking(mode : string,type : string, booking : string) {

      let newBooking$ = this.bookingService.myBooking(type,'new',mode);
      let openBooking$ = this.bookingService.myBooking(type,'open',mode);
      let pendingBooking$ = this.bookingService.myBooking(type,'pending',mode);
      let cancellationpending$ = this.bookingService.myBooking(type,'cancellation%20request',mode);
      let reschedulepending$ = this.bookingService.myBooking(type,'reschedule_request',mode);

      let bookedBooking$ = this.bookingService.myBooking(type,'booked',mode);
      let cancelled$ = this.bookingService.myBooking(type,'cancelled',mode);
      let rescheduled$ = this.bookingService.myBooking(type,'rescheduled',mode);

      switch(mode){
          case 'online' : switch(type){
              case 'flight' : switch (booking) {
                  case 'new' : return forkJoin([openBooking$,pendingBooking$]);
                  case 'history' : return forkJoin([bookedBooking$,cancellationpending$,cancelled$,reschedulepending$,rescheduled$]);
              };
              case 'hotel' : switch (booking) {
                  case 'new' : return forkJoin([openBooking$,pendingBooking$]);
                  case 'history' : return forkJoin([bookedBooking$,cancellationpending$,cancelled$]);
              };
              case 'bus' : switch (booking) {
                  case 'new' : return forkJoin([openBooking$,pendingBooking$]);
                  case 'history' : return forkJoin([bookedBooking$,cancellationpending$,cancelled$]);
              };
              case 'train' : switch (booking) {
                  case 'new' : return of([]);
                  case 'history' : return of([]);
              };
          };
          case 'offline' : switch(type){
              case 'flight' : switch (booking) {
                  case 'new' : return of([]);
                  case 'history' : return forkJoin([bookedBooking$,cancellationpending$,cancelled$,reschedulepending$,rescheduled$]);
              };
              case 'hotel' : switch (booking) {
                  case 'new' : return forkJoin([newBooking$]);
                  case 'history' : return forkJoin([bookedBooking$,cancellationpending$,cancelled$]);
              };
              case 'bus' : switch (booking) {
                  case 'new' : return of([]);
                  case 'history' : return of([]);
              };
              case 'train' : switch (booking) {
                  case 'new' : return forkJoin([newBooking$,openBooking$,pendingBooking$]);
                  case 'history' : return forkJoin([bookedBooking$,cancellationpending$,cancelled$,reschedulepending$,rescheduled$]);
              };
          }
      }
  }

  bookingData(data : HTTPResponse[]) {
      return data.map(
          (el) => {
              return _.isUndefined(JSON.parse(el.data).data) ? [] : JSON.parse(el.data).data;
          }
      );
  }

  tripResponse(data: any[],status : string) : any[] {
    switch(status) {
      case 'active' : {
        return data.map((trip) => {
        if(trip.hasOwnProperty('trip_requests')) {
          console.log(trip);
          let lastdetail = trip.passenger_details.flight_details.length - 1;
          let lastTrip = trip.passenger_details.flight_details[lastdetail].Segments.length - 1;
          let lastFlight = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip].length - 1;
          let sourceplace : string = trip.passenger_details.flight_details[0].Segments[0][0].Origin.Airport.CityName;
          let sourcedate : string = trip.passenger_details.flight_details[0].Segments[0][0].Origin.DepTime;

          let desplace : string = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight].Destination.Airport.CityName;
          let desdate : string = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight].Destination.ArrTime;

          return {
            id : trip.id,
            source: sourceplace,
            destination: desplace,
            startdate : sourcedate,
            enddate : desdate,
            type : 'flight',
            traveldate : sourcedate,
            journey : trip.trip_requests.JourneyType,
            status : trip.status
          }

        }
        else if(trip.hasOwnProperty('hotel_requests')) {
          return {
            id : trip.id,
            source : trip.guest_details.basiscInfo.HotelName,
            destination : trip.guest_details.basiscInfo.CityName,
            startdate : trip.guest_details.basiscInfo.CheckInDate,
            enddate : trip.guest_details.basiscInfo.CheckOutDate,
            type : 'hotel',
            traveldate : trip.guest_details.basiscInfo.CheckInDate,
            status : trip.status
          }

        }
        else if(trip.hasOwnProperty('bus_requests')) {
          return {
            id : trip.id,
            source : trip.passenger_details.selectedbus[0].operatorName,
            destination : trip.passenger_details.selectedbus[0].busType,
            startdate : trip.passenger_details.selectedbus[0].departureTime,
            enddate :trip.passenger_details.selectedbus[0].arrivalTime,
            type : 'bus',
            traveldate : trip.bus_requests[0].doj,
            status : trip.status
          }
        }
        else if(trip.hasOwnProperty('train_requests')) {
            console.log(trip);
            let lastTrip =  trip.train_requests.Segments.length - 1;
            return {
              type : 'train',
              source: trip.train_requests.Segments[0].OriginName,
              destination: trip.train_requests.Segments[lastTrip].DestinationName,
              startdate: moment(trip.train_requests.Segments[0].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
              enddate : moment(trip.train_requests.Segments[lastTrip].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
              id : trip.id,
              traveldate : moment(trip.train_requests.Segments[0].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
              journey : trip.train_requests.JourneyType,
              status : trip.status
            }
        }
        else if(trip.hasOwnProperty('cab_requests')) {
          console.log(trip);
            let lastTrip =  trip.cab_requests.length - 1;
            return {
              type : 'cab',
              source: trip.cab_requests[0].sourceCity,
              destination: trip.cab_requests[lastTrip].destinationCity,
              startdate: moment(trip.cab_requests[0].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
              enddate : moment(trip.cab_requests[lastTrip].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
              id : trip.id,
              traveldate : moment(trip.cab_requests[0].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
              journey : this.journeyType(trip.passenger_details.trip_type),
              status : trip.status
            }
        }
      })
      };
      case 'confirmed' : {
          return data.map((trip) => {
          if(trip.hasOwnProperty('trip_requests')) {
            console.log(trip);
            let lastdetail = trip.passenger_details.flight_details.length - 1;
            let lastTrip = trip.passenger_details.flight_details[lastdetail].Segments.length - 1;
            let lastFlight = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip].length - 1;
            let sourceplace : string = trip.passenger_details.flight_details[0].Segments[0][0].Origin.Airport.CityName;
            let sourcedate : string = trip.passenger_details.flight_details[0].Segments[0][0].Origin.DepTime;

            let desplace : string = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight].Destination.Airport.CityName;
            let desdate : string = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight].Destination.ArrTime;

            return {
              id : trip.id,
              source: sourceplace,
              destination: desplace,
              startdate : sourcedate,
              enddate : desdate,
              type : 'flight',
              traveldate : sourcedate,
              journey : trip.trip_requests.JourneyType,
              status : trip.status
            }

          }
          else if(trip.hasOwnProperty('hotel_requests')) {
            return {
              id : trip.id,
              source : trip.guest_details.basiscInfo.HotelName,
              destination : trip.guest_details.basiscInfo.CityName,
              startdate : trip.guest_details.basiscInfo.CheckInDate,
              enddate : trip.guest_details.basiscInfo.CheckOutDate,
              type : 'hotel',
              traveldate : trip.guest_details.basiscInfo.CheckInDate,
              status : trip.status
            }

          }
          else if(trip.hasOwnProperty('bus_requests')) {
            return {
              id : trip.id,
              source : trip.passenger_details.selectedbus[0].operatorName,
              destination : trip.passenger_details.selectedbus[0].busType,
              startdate : trip.passenger_details.selectedbus[0].departureTime,
              enddate :trip.passenger_details.selectedbus[0].arrivalTime,
              type : 'bus',
              traveldate : trip.bus_requests[0].doj,
              status : trip.status
            }
          }
          else if(trip.hasOwnProperty('train_requests')) {
              console.log(trip);
              let lastTrip =  trip.train_requests.Segments.length - 1;
              return {
                type : 'train',
                source: trip.train_requests.Segments[0].OriginName,
                destination: trip.train_requests.Segments[lastTrip].DestinationName,
                startdate: moment(trip.train_requests.Segments[0].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
                enddate : moment(trip.train_requests.Segments[lastTrip].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
                id : trip.id,
                traveldate : moment(trip.train_requests.Segments[0].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
                journey : trip.train_requests.JourneyType,
                status : trip.status
              }
          }
          else if(trip.hasOwnProperty('cab_requests')) {
            console.log(trip);
              let lastTrip =  trip.train_requests.length - 1;
              return {
                type : 'cab',
                source: trip.cab_requests[0].sourceCity,
                destination: trip.cab_requests[lastTrip].destinationCity,
                startdate: moment(trip.cab_requests[0].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
                enddate : moment(trip.cab_requests[lastTrip].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
                id : trip.id,
                traveldate : moment(trip.cab_requests[0].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
                journey : this.journeyType(trip.passenger_details.trip_type),
                status : trip.status
              }
          }
        });
      };
      case 'completed' : {
        return data.map((trip) => {
        if(trip.hasOwnProperty('trip_requests')) {
          console.log(trip);
          let lastdetail = trip.passenger_details.flight_details.length - 1;
          let lastTrip = trip.passenger_details.flight_details[lastdetail].Segments.length - 1;
          let lastFlight = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip].length - 1;
          let sourceplace : string = trip.passenger_details.flight_details[0].Segments[0][0].Origin.Airport.CityName;
          let sourcedate : string = trip.passenger_details.flight_details[0].Segments[0][0].Origin.DepTime;

          let desplace : string = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight].Destination.Airport.CityName;
          let desdate : string = trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight].Destination.ArrTime;

          return {
            id : trip.id,
            source: sourceplace,
            destination: desplace,
            startdate : sourcedate,
            enddate : desdate,
            type : 'flight',
            traveldate : sourcedate,
            journey : trip.trip_requests.JourneyType,
            status : trip.status
          }

        }
        else if(trip.hasOwnProperty('hotel_requests')) {
          return {
            id : trip.id,
            source : trip.guest_details.basiscInfo.HotelName,
            destination : trip.guest_details.basiscInfo.CityName,
            startdate : trip.guest_details.basiscInfo.CheckInDate,
            enddate : trip.guest_details.basiscInfo.CheckOutDate,
            type : 'hotel',
            traveldate : trip.guest_details.basiscInfo.CheckInDate,
            status : trip.status
          }

        }
        else if(trip.hasOwnProperty('bus_requests')) {
          return {
            id : trip.id,
            source : trip.passenger_details.selectedbus[0].operatorName,
            destination : trip.passenger_details.selectedbus[0].busType,
            startdate : trip.passenger_details.selectedbus[0].departureTime,
            enddate :trip.passenger_details.selectedbus[0].arrivalTime,
            type : 'bus',
            traveldate : trip.bus_requests[0].doj,
            status : trip.status
          }
        }
        else if(trip.hasOwnProperty('train_requests')) {
            console.log(trip);
            let lastTrip =  trip.train_requests.Segments.length - 1;
            return {
              type : 'train',
              source: trip.train_requests.Segments[0].OriginName,
              destination: trip.train_requests.Segments[lastTrip].DestinationName,
              startdate: moment(trip.train_requests.Segments[0].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
              enddate : moment(trip.train_requests.Segments[lastTrip].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
              id : trip.id,
              traveldate : moment(trip.train_requests.Segments[0].depDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
              journey : trip.train_requests.JourneyType,
              status : trip.status
            }
        }
        else if(trip.hasOwnProperty('cab_requests')) {
          console.log(trip);
            let lastTrip =  trip.cab_requests.length - 1;
            return {
              type : 'cab',
              source: trip.cab_requests[0].sourceCity,
              destination: trip.cab_requests[lastTrip].destinationCity,
              startdate: moment(trip.cab_requests[0].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
              enddate : moment(trip.cab_requests[lastTrip].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
              id : trip.id,
              traveldate : moment(trip.cab_requests[0].doj).utc().format("YYYY-MM-DDTHH:mm:ss"),
              journey : this.journeyType(trip.passenger_details.trip_type),
              status : trip.status
            }
        }
      });
      };
    }
  }

  journeyType(type : string) {
    if (type == "one-way") {
      return 1;
    }
    else if (type == "round-trip") {
      return 2;
    }
    else if (type == "multi-city") {
      return 3;
    }
  }



}
