import { State, Selector } from "@ngxs/store";
import { Injectable } from '@angular/core';

export interface Search{
  oneWaySearch: any,
  roundTripSearch: any,
  multiCitySearch: any
}

@State<Search>({
  name : 'search',
  defaults: {
    oneWaySearch: null,
    roundTripSearch: {
      model: [],
      dirty: false,
      status: '',
      errors: {}
    },
    multiCitySearch: {
      model: [],
      dirty: false,
      status: '',
      errors: {}
    }
  }
})
  
@Injectable()
export class SearchState{

  @Selector()
  static oneWayState(state: any) {
    return state.oneWaySearch;
  }

  @Selector()
  static roundTripState(state: any) {
    return state.roundTripSearch;
  } @Selector()
    
  static multiCityState(state: any) {
    return state.multiCitySearch;
  }
  
}