import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { iif, concat } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookingService } from '../services/booking/booking.service';
import { forkJoin, from, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import * as _ from 'lodash';
import { RescheduleComponent, req_segment } from '../components/shared/reschedule/reschedule.component';
import { CancellationComponent } from '../components/shared/cancellation/cancellation.component';
import { city } from './shared.state';
import { GetToken, HotelResultState } from './result/hotel.state';
import { ApprovalService } from '../services/approval/approval.service';

export interface booking {
    type: string
    new: any[]
    history: any[]
    reschedule: any
    loading: boolean
    cancel: any
    mode : string
}

export class MyBooking {
    static readonly type = "[booking] MyBooking";
    constructor(public type : string) {

    }
}

export class ChangeBookingMode {
    static readonly type = "[booking] ChangeBookingMode";
    constructor(public mode : string) {

    }
}

export class DownloadTicket {
    static readonly type = "[booking] DownloadTicket";
    constructor(public booked : string) {

    }
}

export class GetRescheduleTicket {
  static readonly type = "[booking] GetRescheduleTicket";
  constructor(public ticket: any) {}
}


export class RescheduleTicket {
    static readonly type = "[booking] RescheduleTicket";
    constructor(public sector : req_segment[],public remark : string) {

    }
}

export class GetcancelTicket {
  static readonly type = "[booking] GetcancelTicket";
  constructor(public ticket: any) {}
}

export class cancelTicket {
    static readonly type = "[booking] cancelTicket";
    constructor(public ticket : any) {

    }
}

export class ViewFile {
    static readonly type = "[booking] ViewFile";
    constructor(public pnr : string) {

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
  },
})
export class BookingState {
  constructor(
    private store: Store,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private bookingService: BookingService,
    private file: File,
    private transfer: FileTransfer,
    private fileOpener: FileOpener,
    private approvalService : ApprovalService
  ) {}

  @Selector()
  static getNewBooking(state: booking): any[] {
    return state.new;
  }

  @Selector()
  static getHistoryBooking(state: booking): any[] {
    return state.history;
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
  static getRescheduleTicket(state: booking): any {
    return state.reschedule;
  }

  @Selector()
  static getCancelTicket(state: booking): any {
    return state.cancel;
  }

  @Selector()
  static getBookingMode(state : booking) : string {
      return state.mode;
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
                    (booking) => {
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
                            openBooking$,
                            newBooking$,
                            pendingBooking$,
                        ]);

                        let historybooking$ = forkJoin([
                            bookedBooking$,
                            cancellationpending$,
                            cancelled$,
                            reschedulepending$,
                            rescheduled$
                        ]);

                        return forkJoin([newbooking$,historybooking$]);
                    }
                ),
                flatMap(
                    (response) => {
                        console.log(response);
                        let newResponse = response[0];
                        let historyResponse = response[1];

                        let newArray = _.flatMap(this.bookingData(newResponse));
                        let historyArray = _.flatMap(this.bookingData(historyResponse));

                        console.log(newArray,historyArray);

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
                      console.log(response);
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
                          console.log(response);
                          let newResponse = response[0];
                          let historyResponse = response[1];
  
                          let newArray = _.flatMap(this.bookingData(newResponse));
                          let historyArray = _.flatMap(this.bookingData(historyResponse));
  
                          console.log(newArray,historyArray);
  
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
  viewFile(states: StateContext<booking>, action: ViewFile) {
    const failedAlert$ = from(
      this.alertCtrl.create({
        header: "File Error",
        subHeader: "File Not Found",
        buttons: [
          {
            text: "Retry",
            handler: () => {
              this.store.dispatch(new DownloadTicket(action.pnr));
            },
          },
        ],
      })
    ).pipe(
      map((alert) => {
        return from(alert.present());
      })
    );
    let fileopener$ = from(
      this.fileOpener.open(
        this.file.externalRootDirectory +
          "/TravellersPass/Ticket/" +
          action.pnr +
          ".pdf",
        "application/pdf"
      )
    );

    return fileopener$.pipe(
      catchError((error) => {
        if (error.status == 9) {
          return failedAlert$;
        }
      })
    );
  }

  @Action(RescheduleTicket)
  rescheduleTicket(states: StateContext<booking>, action: RescheduleTicket) {

    const successAlert$ = from(
      this.alertCtrl.create({
        header: "Approve Success",
        subHeader: "Request has been approved successfully",
        buttons: [
          {
            text: "OK",
            handler: () => {
              return concat(
                from(this.modalCtrl.dismiss("reschedule-ticket")),
                states.dispatch(new MyBooking(states.getState().type))
              );
            },
          },
        ],
      })
    ).pipe(flatMap((el) => from(el.present())));
    
    let failedAlert$ = from(
      this.alertCtrl.create({
        header: "Approve Failed",
        subHeader: "Failed to Approve the Request",
        buttons: [
          {
            text: "Cancel",
            handler: () => {
              states.dispatch(new MyBooking(states.getState().type));
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
      "updatedAt"
    ]);

    let type = states.getState().type;

    console.log(JSON.stringify(reschedule));

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
        console.log(error);
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
  getrescheduleTicket(
    states: StateContext<booking>,
    action: GetRescheduleTicket
  ) {
    const modal$ = from(
      this.modalCtrl.create({
        component: RescheduleComponent,
        id: "reschedule-ticket",
      })
    ).pipe(flatMap((el) => from(el.present())));

    states.patchState({
      reschedule: action.ticket,
    });

    return modal$;
  }

  @Action(GetcancelTicket)
  getcancelTicket(states: StateContext<booking>, action: GetcancelTicket) {
    const modal$ = from(
      this.modalCtrl.create({
        component: CancellationComponent,
        id: "cancellation-ticket",
      })
    ).pipe(flatMap((el) => from(el.present())));

    states.patchState({
      cancel: action.ticket
    });

    return modal$;
  }

  @Action(cancelTicket)
  cancelTicket(states: StateContext<booking>, action: cancelTicket) {

  }

  getBooking(mode : string,type : string, booking : string) {

      let newBooking$ = this.bookingService.myBooking(type,'new',mode);
      let openBooking$ = this.bookingService.myBooking(type,'open',mode);
      let pendingBooking$ = this.bookingService.myBooking(type,'pending',mode);

      let bookedBooking$ = this.bookingService.myBooking(type,'booked',mode);
      let cancellationpending$ = this.bookingService.myBooking(type,'cancellation%20request',mode);
      let cancelled$ = this.bookingService.myBooking(type,'cancelled',mode);
      let reschedulepending$ = this.bookingService.myBooking(type,'reschedule_request',mode);
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
              console.log(JSON.parse(el.data));
              return _.isUndefined(JSON.parse(el.data).data) ? [] : JSON.parse(el.data).data;
          }
      );
  }

}