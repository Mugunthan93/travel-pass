import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import * as _ from 'lodash';
import { staticresponselist, hotelresultlist } from '../../search/hotel.state';

export interface hotelFilter {
    place : Places[]
    starRating: number
    price : number
}

export interface Places {
    name: string,
    value: boolean
}


//////////////////////////////////////////////////

export class GetPlaces {
    static readonly type = "[hotel_filter] GetPlaces";
    constructor(public result: (staticresponselist & hotelresultlist)[]) {

    }
}

export class SetStarRating {
    static readonly type = "[hotel_filter] SetStarRating";
    constructor(public rating : number) {

    }
}

export class SetHotelPrice {
    static readonly type = "[hotel_filter] SetHotelPrice";
    constructor(public price : number) {

    }
}

export class SetPlaces {
    static readonly type = "[hotel_filter] SetPlaces";
    constructor(public places: Places, public airboolean: boolean) {

    }
}

export class ResetPlaces {
    static readonly type = "[hotel_filter] ResetPlaces";
}

@State<hotelFilter>({
    name: 'hotel_filter',
    defaults: {
        place: [],
        starRating: -1,
        price: 0
    }
})

@Injectable()
export class HotelFilterState {

    @Selector()
    static getFilter(state: hotelFilter) {
        return state;
    }

    @Action(GetPlaces)
    getPlaces(states: StateContext<hotelFilter>,action : GetPlaces ) {
        let places: Places[] = [];
        let currentplaces: (staticresponselist & hotelresultlist)[] = Object.assign([], action.result);
        let filteredplaces = currentplaces.filter(el => el.Place !== null);
        filteredplaces.forEach(
            (el) => {
                places.push({
                    name: el.Place,
                    value: false
                });
            }
        );

        states.patchState({
            place: _.uniqBy(places, 'name'),
            starRating: -1,
            price: 0
        })
    }

    @Action(SetStarRating)
    setStarRating(states: StateContext<hotelFilter>, action: SetStarRating) {
        states.patchState({
            starRating: action.rating
        });
    }

    @Action(SetHotelPrice)
    setPrice(states: StateContext<hotelFilter>, action: SetHotelPrice) {
        states.patchState({
            price: action.price
        });
    }

    @Action(SetPlaces)
    setPlaces(states: StateContext<hotelFilter>, action: SetPlaces) {

        let places: Places[] = Object.assign([], states.getState().place);
        let places2: Places[] = places.map(
            (el) => {
                if (_.isEqual(el, action.places)) {
                    let newair: Places = Object.assign({}, el);
                    newair.value = action.airboolean;
                    return newair;
                }
                return el;
            }
        );

        states.patchState({
            place: places2
        });
    }


    @Action(ResetPlaces)
    resetPlaces(states: StateContext<hotelFilter>) {
        let airlines: Places[] = Object.assign([], states.getState().place);
        let init: Places[] = airlines.map(
            (el) => {
                let item: Places = Object.assign({}, el);
                item.value = false;
                return item;
            }
        );

        states.patchState({
            place: init
        });
    }


}
