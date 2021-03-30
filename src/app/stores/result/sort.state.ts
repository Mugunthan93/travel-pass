import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ResultState, result } from '../result.state';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { patch, updateItem } from '@ngxs/store/operators';

export interface sort {
    flight: sortButton[]
    departure: sortButton[];
    return: sortButton[];
    hotel: sortButton[]
    bus: sortButton[]
    currentFlight: sortButton
    currentdeparture: sortButton
    currentreturn: sortButton
    currentHotel: sortButton
    currentBus: sortButton
}

export interface sortButton {
    label: string
    state: string
    property: string
}

export class SortChange {
    static readonly type = "[Sort] SortChange";
    constructor(public button: sortButton, public mode: string, public type?: string) {

    }
}

export class SortBy {
    static readonly type = "[Sort] SortBy";
    constructor(public button: sortButton, public mode: string, public type?: string) {

    }
}


@State<sort>({
    name: 'sort',
    defaults: {
        flight: [
            { label: 'departure', state: 'default', property: 'departure' },
            { label: 'arrival', state: 'default', property: 'arrival' },
            { label: 'duration', state: 'default', property: 'Duration' },
            { label: 'price', state: 'default', property: 'fare' }
        ],
        departure: [
            { label: 'departure', state: 'default', property: 'departure' },
            { label: 'arrival', state: 'default', property: 'arrival' },
            { label: 'duration', state: 'default', property: 'Duration' },
            { label: 'price', state: 'default', property: 'fare' }
        ],
        return: [
            { label: 'departure', state: 'default', property: 'departure' },
            { label: 'arrival', state: 'default', property: 'arrival' },
            { label: 'duration', state: 'default', property: 'Duration' },
            { label: 'price', state: 'default', property: 'fare' }
        ],
        hotel: [
            { label: 'hotel', state: 'default', property: 'HotelName' || 'hotel_name' },
            { label: 'star', state: 'default', property: 'StarRating' || 'star_rating' },
            { label: 'price', state: 'default', property: 'PublishedPrice' || 'price'}
        ],
        bus: [
            { label: 'departure', state: 'default', property: 'departureTime' },
            { label: 'arrival', state: 'default', property: 'arrivalTime' },
            { label: 'seat', state: 'default', property: 'availableSeats' },
            { label: 'fare', state: 'default', property: 'fare' }
        ],
        currentFlight: { label: 'price', state: 'rotated', property: 'fare' },
        currentdeparture: { label: 'price', state: 'rotated', property: 'fare' },
        currentreturn: { label: 'price', state: 'rotated', property: 'fare' },
        currentHotel: { label: 'price', state: 'rotated', property: 'PublishedPrice' },
        currentBus: { label: 'fare', state: 'default', property: 'fare' }
    }
})

@Injectable()
export class SortState {

    constructor() {

    }

    @Selector([ResultState])
    static getButtons(states: sort, resultstate : result): sortButton[] {
        if (resultstate.mode == 'flight') {
            return states.flight;
        }
        else if (resultstate.mode == 'hotel') {
            return states.hotel;
        }
        else if (resultstate.mode == 'bus') {
            return states.bus;
        }
    }

    @Selector()
    static getDepartureButtons(states: sort): sortButton[] {
        return states.departure;
    }

    @Selector()
    static getReturnButtons(states: sort): sortButton[] {
        return states.return;
    }

    @Selector()
    static getFlightSortBy(states: sort): sortButton {
        return states.currentFlight;
    }

    @Selector()
    static getDepartureSortBy(states: sort): sortButton {
        return states.currentdeparture;
    }

    @Selector()
    static getReturnSortBy(states: sort): sortButton {
        return states.currentreturn;
    }

    @Selector()
    static getHotelSortBy(states: sort): sortButton {
        return states.currentHotel;
    }

    @Selector()
    static getBusSortBy(states: sort): sortButton {
        return states.currentBus;
    }

    @Action(SortChange)
    sortChange(states: StateContext<sort>, action: SortChange) {
      switch(action.mode) {
        case 'flight' : switch(action.type) {
          case 'departure' : states.setState(patch({
            departure : updateItem((el : any) => action.button.property !== el.property,patch({state : "default"})),
            currentdeparture : patch(action.button)
          }));
          case 'return' : states.setState(patch({
            return : updateItem((el : any) => action.button.property !== el.property,patch({state : "default"})),
            currentreturn : patch(action.button)
          }));
        };
        case 'flight' : states.setState(patch({
          flight : updateItem((el : any) => action.button.property !== el.property,patch({state : "default"})),
          currentFlight : patch(action.button)
        }));
        case 'hotel' : states.setState(patch({
          hotel : updateItem((el : any) => action.button.property !== el.property,patch({state : "default"})),
          currentHotel : patch(action.button)
        }));
        case 'bus' : states.setState(patch({
          bus : updateItem((el : any) => action.button.property !== el.property,patch({state : "default"})),
          currentBus : patch(action.button)
        }));
      }
    }

    @Action(SortBy)
    sortBy(states: StateContext<sort>, action: SortBy) {

        switch(action.mode) {
            case 'flight' : switch(action.type) {
              case 'departure' : states.setState(patch({
                departure : updateItem((el : any) => action.button.property == el.property,patch({
                    state : action.button.state == "default" ? "rotated" : "default"
                })),
                currentdeparture : patch(action.button)
              }));
              case 'return' : states.setState(patch({
                return : updateItem((el : any) => action.button.property == el.property,patch({
                    state : action.button.state == "default" ? "rotated" : "default"
                })),
                currentreturn : patch(action.button)
              }));
            };
            case 'flight' : states.setState(patch({
              flight : updateItem((el : any) => action.button.property == el.property,patch({
                  state : action.button.state == "default" ? "rotated" : "default"
              })),
              currentFlight : patch(action.button)
            }));
            case 'hotel' : states.setState(patch({
              hotel : updateItem((el : any) => action.button.property == el.property,patch({
                  state : action.button.state == "default" ? "rotated" : "default"
                })),
              currentHotel : patch(action.button)
            }));
            case 'bus' : states.setState(patch({
              bus : updateItem((el : any) => action.button.property == el.property,patch({
                  state : action.button.state == "default" ? "rotated" : "default"
                })),
              currentBus : patch(action.button)
            }));
          }
    }

}
