import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { patch } from "@ngxs/store/operators";
import { flightpassenger } from "../passenger/flight.passenger.states";
import { buscity } from "../shared.state";
import * as moment from 'moment';
import { CompanyState } from "../company.state";
import { UserState } from "../user.state";
import { CabPassengerState } from "../passenger/cab.passenger.state";
import { CabService } from "src/app/services/cab/cab.service";
import { catchError, flatMap, map } from "rxjs/operators";
import { HTTPResponse } from "@ionic-native/http/ngx";
import { from } from "rxjs";
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { Navigate } from "@ngxs/router-plugin";
import { StateReset } from "ngxs-reset-plugin";
import { SearchState } from "../search.state";
import { BookState } from "../book.state";

export interface cab{
  travelType : string,
  tripType : string,
  cabform : cabform
}

export interface cabrequest {
  passenger_count: number,
  cab_requests: cab_request[],
  purpose: string,
  status: string,
  booking_mode: string,
  customer_id: number,
  transaction_id: any,
  user_id: number,
  trip_type: string,
  comments: any,
  cab_type: string,
  passenger_details: {
    mode_of_request: string,
    trip_type: string,
    passenger: flightpassenger[]
  },
  managers: {
    id: number,
    name: string,
    email: string
  }
}

export interface cab_request {
  sourceCity: string,
  destinationCity: string,
  doj: string
}

export interface cabform {
  source: buscity,
  departure : string,
  cab_type : string,
  passenger : string

  destination?: buscity
  return?: string
  trip_type?: string
  trips?: trips[]
}

export interface onewaycabform extends cabform{
  destination: buscity
}

export interface roundtripcabform extends cabform{
  destination: buscity
  return: string
}

export interface multicitycabform{
  trips: trips[]
  cab_type : string
  passenger : string
}

export interface localcabform extends cabform{
  return: string
}

export interface airportcabform extends cabform{
  trip_type: string,
}

export interface trips {
  source: buscity,
  destination: buscity,
  departure: string
}

//class

export class TravelType {
  static readonly type = "[Cab] TravelType";
  constructor(public type : string) {

  }
}

export class TripType {
  static readonly type = "[Cab] JourneyType";
  constructor(public type : string) {

  }
}

export class SetCabForm {
  static readonly type = "[Cab] CabForm";
  constructor(public form : cabform ) {

  }
}

export class SendCabOfflineRequest {
  static readonly type = "[Cab] SendCabOfflineRequest";
  constructor(public comment: string, public mailCC: string[],public purpose : string) {

  }
}

@State<cab>({
  name : 'cabsearch',
  defaults: {
    travelType : "out-station",
    tripType : "one-way",
    cabform : null
},
})

@Injectable()
export class CabSearchState {

  constructor(
    private store : Store,
    private cabService : CabService,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    public modalCtrl : ModalController
  ) {

  }

  @Selector()
  static getCabForm(state : cab) : cabform {
    return state.cabform;
  }

  @Selector()
  static getTravelType(states : cab) : string {
    return states.travelType;
  }

  @Selector()
  static getTripType(states: cab) : string {
      return states.tripType;
  }

  @Action(TripType)
  tripType(states: StateContext<cab>, action: TripType) {
      states.setState(patch({
        tripType : action.type
      }));
  }

  @Action(TravelType)
  travelType(states: StateContext<cab>, action: TravelType) {
    states.setState(patch({
      travelType : action.type
    }));
  }


  @Action(SetCabForm)
  setCabForm(states: StateContext<cab>, action: SetCabForm) {

    if(action.form.departure) {
      action.form.departure = moment(action.form.departure).format('YYYY-MM-DD')
    }
    if(action.form.return) {
      action.form.departure = moment(action.form.return).format('YYYY-MM-DD')
    }

    states.setState(patch({
      cabform : action.form
    }));
  }

  @Action(SendCabOfflineRequest)
  sendCabOfflineRequest(states: StateContext<cab>, action: SendCabOfflineRequest) {

    let loading$ = from(this.loadingCtrl.create({
      spinner: "crescent",
      message: "Request Sending",
      id : "cab-load"
    })).pipe(flatMap(el => from(el.present())));

    let failedAlert$ = from(this.alertCtrl.create({
        header: 'Send Request Failed',
        buttons: [{
            text: 'Ok',
            role: 'ok',
            cssClass: 'danger',
            handler: () => {
                this.alertCtrl.dismiss({
                    data: false,
                    role: 'failed'
                });
            }
        }]
    })).pipe(flatMap(el => from(el.present())));

    let successAlert$ = from(this.alertCtrl.create({
        header: 'Send Request Success',
        subHeader: 'Request status will be updated in My Bookings',
        buttons: [{
            text: 'Ok',
            role: 'ok',
            cssClass: 'danger',
            handler: () => {
              this.alertCtrl.dismiss({
                data: false,
                role: 'failed'
              });
              this.modalCtrl.dismiss(null, null,'book-confirm');
              this.store.dispatch(new StateReset(SearchState, BookState));
              this.store.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
            }
        }]
    })).pipe(flatMap(el => from(el.present())));

    let req : cab_request[] = null;
    switch(states.getState().tripType) {
      case "one-way" : req = [{
        sourceCity: states.getState().cabform.source.station_name,
        destinationCity: states.getState().cabform.destination.station_name,
        doj: states.getState().cabform.departure
      }];
      case "round-trip" : req = [
        {
          sourceCity: states.getState().cabform.source.station_name,
          destinationCity: states.getState().cabform.destination.station_name,
          doj: states.getState().cabform.departure
        },
        {
          sourceCity: states.getState().cabform.destination.station_name,
          destinationCity: states.getState().cabform.source.station_name,
          doj: states.getState().cabform.return
        }
      ];
      case "multi-city" : case "local" : case "airport" : req = [];
    }

    let offreq : cabrequest = {
      passenger_count: parseInt(states.getState().cabform.passenger),
      cab_requests: req,
      purpose: action.purpose,
      status: "new",
      booking_mode: "offline",
      customer_id: this.store.selectSnapshot(CompanyState.getId),
      transaction_id: null,
      user_id: this.store.selectSnapshot(UserState.getUserId),
      trip_type: "business",
      comments: action.comment,
      cab_type: states.getState().cabform.cab_type,
      passenger_details: {
        mode_of_request: states.getState().travelType,
        trip_type: states.getState().tripType,
        passenger: this.store.selectSnapshot(CabPassengerState.getSelectedPassengers)
      },
      managers: this.store.selectSnapshot(UserState.getApprover)
    }

    return loading$
      .pipe(
        flatMap(() => this.cabService.offlineRequest(offreq)),
        flatMap(
          (res : HTTPResponse) => {
            console.log(res);
            return from(this.loadingCtrl.dismiss(null,null,"cab-load"))
              .pipe(
                flatMap(() => successAlert$)
              );
          }
        ),
        catchError(
          (error) => {
            console.log(error);
            return from(this.loadingCtrl.dismiss(null,null,"cab-load"))
              .pipe(
                flatMap(() => failedAlert$)
              );
          }
        )
      );

  }


}
