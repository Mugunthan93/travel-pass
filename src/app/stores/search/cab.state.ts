import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { patch } from "@ngxs/store/operators";
import { flightpassenger } from "../passenger/flight.passenger.states";
import { buscity } from "../shared.state";

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

  constructor() {

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
    states.setState(patch({
      cabform : action.form
    }));
  }


}
