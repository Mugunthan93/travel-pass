import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SharedService } from '../services/shared/shared.service';
import * as _ from 'lodash';

export interface Shared {
    flightCity: city[],
    hotelCity: hotelcity[],
    nationality: string[]
}

export interface city {
    airport_code: string
    airport_name: string
    city_code: string
    city_name: string
    country_code: string
    country_name: string
    currency: string
    nationalty: string
}

export interface hotelcity {
    cityid: number
    country: string
    countrycode: string
    destination: string
    stateprovince: string
    stateprovincecode: string
}

export class GetFlightCity {
    static readonly type = '[Shared] GetFlightCity';
    constructor(public city : string) {
        
    }
}

export class GetHotelCity {
    static readonly type = '[Shared] GetHotelCity';
    constructor(public city: string) {

    }
}

export class GetNationality {
    static readonly type = '[hotel_search] GetNationality';
    constructor(public keyword: string) {

    }
}

@State<Shared>({
    name: 'Shared',
    defaults: {
        flightCity: [],
        hotelCity: [],
        nationality:[]
    }
})
export class SharedState {
    
    constructor(
        private sharedService: SharedService
    ) {

    }

    @Selector()
    static flightcities(state: Shared) {
        return state.flightCity;
    }

    @Selector()
    static hotelcities(state: Shared) {
        return state.hotelCity;
    }

    @Action(GetFlightCity, {cancelUncompleted: true})
    async getflightCity(states: StateContext<Shared>, action: GetFlightCity) {
        try {

            const city = await this.sharedService.searchFlightCity(action.city);
            const parsedCity: city[] = JSON.parse(city.data);

            states.patchState({
                flightCity: parsedCity
            });
        }
        catch (error) {
            console.log(error);  
        }
    }

    @Action(GetHotelCity, {cancelUncompleted: true})
    async gethotelCity(states: StateContext<Shared>, action: GetHotelCity) {
        try {

            const city = await this.sharedService.searchHotelCity(action.city);
            const parsedCity: hotelcity[] = JSON.parse(city.data);

            states.patchState({
                hotelCity: parsedCity
            });
        }
        catch (error) {
            console.log(error);  
        }
    }

    @Action(GetNationality)
    async getNationality(states: StateContext<Shared>, action: GetNationality) {
        try {
            const cityResponse = await this.sharedService.getNationality(action.keyword);
            console.log(cityResponse);
        }
        catch (error) {
            console.log(error);
        }
    }
}