import { State, Selector } from '@ngxs/store';

export interface hotelFilter {
    place : Places[]
    starRating: number
    price : number
}

export interface Places {
    name: string,
    value: boolean
}

@State<hotelFilter>({
    name: 'flight_filter',
    defaults: {
        place: [],
        starRating: -1,
        price: 0
    }
})

export class HotelFilterState {

    @Selector()
    static getFilter(state: hotelFilter) {
        return state;
    }
    
}