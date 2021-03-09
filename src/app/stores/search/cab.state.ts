import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";

export interface cab{
  JourneyType : number,
  travelType : string
}

//class

export class JourneyType {
  static readonly type = "[Cab] JourneyType";
  constructor(public type : string) {

  }
}

export class TravelType {
  static readonly type = "[Cab] TravelType";
  constructor(public type : string) {

  }
}

@State<cab>({
  name : 'cabsearch',
  defaults: {
    JourneyType : 1,
    travelType : "out-station"
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
  static getJourneyType(states: cab) : number {
      return states.JourneyType;
  }

  @Action(JourneyType)
  journeyType(states: StateContext<cab>, action: JourneyType) {
      if (action.type == "one-way") {
          states.patchState({
              JourneyType:1
          });
      }
      else if (action.type == "round-trip") {
          states.patchState({
              JourneyType:2
          });
      }
      else if (action.type == "multi-city") {
          states.patchState({
              JourneyType:3
          });
      }
  }

  @Action(TravelType)
  travelType(states: StateContext<cab>, action: TravelType) {

    if(action.type == "out-station") {

    }
    else if(action.type == "local") {

    }
    else if(action.type == "airport"){

    }

    states.patchState({
      travelType : action.type
    });
  }

}
