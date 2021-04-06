import { Action, Selector, State, StateContext } from "@ngxs/store";
import { TrainOneWayBookState } from './train/one-way.state';
import { TrainRoundTripBookState } from './train/round-trip.state';
import { TrainMultiCityBookState } from './train/multi-city.state';
import { Injectable } from "@angular/core";
import { patch } from "@ngxs/store/operators";

export interface trainbook {
  trainname : string
  traintype : string
}

export class SetTrainName {
  static readonly type = "[train_book] SetTrainName";
  constructor(public name : string) {

  }
}

export class SetTrainType {
  static readonly type = "[train_book] SetTrainType";
  constructor(public type : string) {

  }
}


@State({
    name: 'train_book',
    defaults: null,
    children: [
        TrainOneWayBookState,
        TrainRoundTripBookState,
        TrainMultiCityBookState
    ]
})

@Injectable()
export class TrainBookState {

    constructor() {

    }

    @Selector()
    static getTrainName(state : trainbook) : string {
      return state.trainname;
    }

    @Selector()
    static getTrainType(state : trainbook) : string {
      return state.traintype;
    }

    @Action(SetTrainName)
    setTrainName(states : StateContext<trainbook>,action : SetTrainName) {
      states.setState(patch({
        trainname : action.name
      }));
    }

    @Action(SetTrainType)
    setTrainType(states : StateContext<trainbook>,action : SetTrainType) {
      states.setState(patch({
        trainname : action.type
      }));
    }

}
