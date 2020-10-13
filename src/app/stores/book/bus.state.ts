import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { managers, user_eligibility } from './flight.state';
import { busResponse, droppingPoint, boardingPoint, BusResultState, seat } from '../result/bus.state';
import { BusSearchState } from '../search/bus.state';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { CompanyState } from '../company.state';
import { GST } from './flight/oneway.state';
import { UserState } from '../user.state';
import * as moment from 'moment';
import { BookMode } from '../book.state';
import { forkJoin, from, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { BusService } from 'src/app/services/bus/bus.service';
import { AddBusPassenger, buspassenger, BusPassengerState } from '../passenger/bus.passenger.state';


export interface busbook {
    passenger_details: passenger_details
    bus_requests: busrequests[]
}

export interface passenger_details {
    blockSeatPaxDetails: buspassenger[]
    selectedbus: busResponse[]
    fareDetails: fareDetails
    userEligibility: user_eligibility
}

export interface fareDetails {
    total_amount: number,
    service_Charges: number,
    sgst_Charges: number,
    cgst_Charges: number,
    markup_Charges: number,
    igst_Charges: number
}

export interface busrequests {
    inventoryType: number
    routeScheduleId: string
    sourceCity: string
    destinationCity: string
    doj: string
    droppingPoint: droppingPoint[]
    boardingPoint: boardingPoint[]
}

////////////////////////////////////////////////////////////////

export class GetBookDetail {
    static readonly type = "[bus_book] GetBookDetail";
    constructor(public currentbus : busResponse,public boarding : boardingPoint, public dropping: droppingPoint) {

    }
}

export class BusRequest {
    static readonly type = "[bus_book] BusRequest";
    constructor(public comment: string, public mailCC: string[],public purpose : string) {

    }
}


@State<busbook>({
  name: "bus_book",
  defaults: {
    passenger_details: null,
    bus_requests: [],
  },
})
export class BusBookState {
  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private busService: BusService
  ) {}

  @Selector()
  static getFare(state: busbook): number {
    return state.passenger_details.fareDetails.total_amount;
  }

  @Selector()
  static getFareDetail(state: busbook): fareDetails {
    return state.passenger_details.fareDetails;
  }
    
  @Action(GetBookDetail)
  getBookDetail(states: StateContext<busbook>, action: GetBookDetail) {
    let busrequest: busrequests = Object.assign(
      {},
      {
        inventoryType: action.currentbus.inventoryType,
        routeScheduleId: action.currentbus.routeScheduleId,
        sourceCity: this.store.selectSnapshot(BusSearchState.getPayload)
          .sourceCity,
        destinationCity: this.store.selectSnapshot(BusSearchState.getPayload)
          .destinationCity,
        doj: this.store.selectSnapshot(BusSearchState.getPayload).doj,
        droppingPoint: [action.boarding],
        boardingPoint: [action.dropping],
      }
    );

    let currenReq: busrequests[] = Object.assign(
      [],
      states.getState().bus_requests
    );
    currenReq.push(busrequest);

    let leadPassenger: buspassenger = {
      primary: true,
      email: this.store.selectSnapshot(UserState.getEmail),
      name: this.store.selectSnapshot(UserState.getFirstName),
      lastName: this.store.selectSnapshot(UserState.getLastName),
      Address: this.store.selectSnapshot(UserState.getAddress),
      mobile: this.store.selectSnapshot(UserState.getContact),
      idType: "PAN Card",
      idNumber: this.store.selectSnapshot(UserState.getPassportNo),
      title:this.store.selectSnapshot(UserState.getTitle) == "Female" ? "Ms" : "Mr",
      sex:this.store.selectSnapshot(UserState.getTitle) == "Female" ? "F" : "M",
      age: moment().diff(this.store.selectSnapshot(UserState.getDOB), "years", false).toString(),
      seatNbr: null,
      fare: parseInt(action.currentbus.fare),
      serviceTaxAmount: 0,
      operatorServiceChargeAbsolute: 0,
      totalFareWithTaxes: parseInt(action.currentbus.fare),
      ladiesSeat: this.store.selectSnapshot(BusResultState.getselectedSeat)[0].ladiesSeat,
      nameOnId: this.store.selectSnapshot(UserState.getFirstName),
      ac: this.store.selectSnapshot(BusResultState.getselectedSeat)[0].ac,
      sleeper: this.store.selectSnapshot(BusResultState.getselectedSeat)[0].sleeper,
      prefSeat: this.store.selectSnapshot(BusResultState.SeatNumbers)[0],
    };

    states.dispatch(new AddBusPassenger(leadPassenger));

    let passenger_details: passenger_details = {
      blockSeatPaxDetails: [leadPassenger],
      selectedbus: [action.currentbus],
      fareDetails: {
        total_amount:
          parseInt(action.currentbus.fare) *
            this.store.selectSnapshot(BusSearchState.getPassengersCount) +
          this.serviceCharges() +
          this.GST().sgst +
          this.GST().cgst +
          this.GST().igst,
        service_Charges: this.serviceCharges(),
        sgst_Charges: this.GST().sgst,
        cgst_Charges: this.GST().cgst,
        igst_Charges: this.GST().igst,
        markup_Charges: this.store.selectSnapshot(
          CompanyState.getBusMarkupCharge
        ),
      },
      userEligibility: {
        msg: null,
        company_type: "corporate",
      },
    };

    states.patchState({
      passenger_details: passenger_details,
      bus_requests: currenReq,
    });

    this.modalCtrl.dismiss(null, null, "pick-drop");
    this.modalCtrl.dismiss(null, null, "seat-select");
    states.dispatch(new BookMode("bus"));
    states.dispatch(new Navigate(["/", "home", "book", "bus"]));
  }

  @Action(BusRequest)
  sendRequest(states: StateContext<busbook>, action: BusRequest) {

    let detail = Object.assign({},states.getState().passenger_details);
    detail.blockSeatPaxDetails = this.store.selectSnapshot(BusPassengerState.getSelectPassenger);

    let sendreq = {
      passenger_details: detail,
      bus_requests: states.getState().bus_requests,
      transaction_id: null,
      user_id: this.store.selectSnapshot(UserState.getUserId),
      customer_id: this.store.selectSnapshot(UserState.getcompanyId),
      booking_mode: "online",
      trip_type: "business",
      comments: action.comment,
      purpose: action.purpose,
      cancellation_charges: null,
      status: "pending",
      approval_mail_cc: action.mailCC,
      managers: this.store.selectSnapshot(UserState.getApprover),
    };

    let loading$ = from(
      this.loadingCtrl.create({
        spinner: "crescent",
        message: "Sending Request...",
        id: "send-req-loading",
      })
    ).pipe(
      flatMap((loadingEl) => {
        return from(loadingEl.present());
      })
    );

    let failedAlert$ = from(
      this.alertCtrl.create({
        header: "Send Request Failed",
        buttons: [
          {
            text: "Ok",
            role: "ok",
            handler: () => {
              return false;
            },
          },
        ],
      })
    ).pipe(
      flatMap((alertEl) => {
        return from(alertEl.present());
      })
    );

    let successAlert$ = from(
      this.alertCtrl.create({
        header: "Request Success",
        subHeader: "Send Request Success",
        message: "Request Sent Successfully..",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              states
                .dispatch(new Navigate(["/", "home", "dashboard", "home-tab"]))
                .subscribe({
                  complete: () => {
                    this.modalCtrl.dismiss(null, null, "book-confirm");
                  },
                });
            },
          },
        ],
      })
    ).pipe(
      flatMap((alertEl) => {
        return from(alertEl.present());
      })
    );

    let sendRequest$ = from(this.busService.sendRequest(sendreq));

    return forkJoin(loading$, sendRequest$).pipe(
      flatMap((el) => {
        console.log(el);
        if (el[1].status == 200) {
          console.log(JSON.parse(el[1].data));
          return forkJoin(
            from(this.loadingCtrl.dismiss(null, null, "send-req-loading")),
            successAlert$
          );
        } else {
          return forkJoin(
            from(this.loadingCtrl.dismiss(null, null, "send-req-loading")),
            failedAlert$
          );
        }
      }),
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

  serviceCharges(): number {
    let serviceCharge: number = 0;
    serviceCharge =
      this.store.selectSnapshot(CompanyState.getBusServiceCharge) *
      this.store.selectSnapshot(BusSearchState.getPassengersCount);
    return serviceCharge;
  }

  GST(): GST {
    if (this.store.selectSnapshot(CompanyState.getStateName) == "Tamil Nadu") {
      return {
        cgst: (this.serviceCharges() * 9) / 100,
        sgst: (this.serviceCharges() * 9) / 100,
        igst: 0,
      };
    } else if (
      this.store.selectSnapshot(CompanyState.getStateName) !== "Tamil Nadu"
    ) {
      return {
        cgst: 0,
        sgst: 0,
        igst: (this.serviceCharges() * 18) / 100,
      };
    }
  }
}
