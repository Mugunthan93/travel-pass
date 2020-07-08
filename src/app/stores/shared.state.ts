import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SharedService } from '../services/shared/shared.service';
import * as _ from 'lodash';

export interface Shared {
    flightCity: city[],
    hotelCity: hotelcity[]
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

export class ClearCity {
    static readonly type = '[Shared] ClearCity';
}

@State<Shared>({
    name: 'Shared',
    defaults: {
        flightCity: [],
        hotelCity:[]
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
            const currentState = states.getState();

            const city = await this.sharedService.searchFlightCity(action.city);
            const parsedCity: city[] = JSON.parse(city.data);

            states.setState({
                flightCity: parsedCity,
                hotelCity : currentState.hotelCity
            });
        }
        catch (error) {
            console.log(error);  
        }
    }

    @Action(GetHotelCity, {cancelUncompleted: true})
    async gethotelCity(states: StateContext<Shared>, action: GetHotelCity) {
        try {
            const currentState = states.getState();

            const city = await this.sharedService.searchHotelCity(action.city);
            const parsedCity: hotelcity[] = JSON.parse(city.data);

            states.setState({
                flightCity: currentState.flightCity,
                hotelCity: parsedCity
            });
        }
        catch (error) {
            console.log(error);  
        }
    }
}