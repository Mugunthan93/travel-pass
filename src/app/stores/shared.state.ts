import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SharedService } from '../services/shared/shared.service';
import * as _ from 'lodash';
import { from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';

export interface Shared {
    flightCity: city[],
    hotelCity: hotelcity[],
    nationality: nationality[],
    busCity: buscity[],
    trainStation : trainstation[]
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
    cityid?: number
    countrycode? : string
}

export interface hotelcity {
    cityid: number
    country: string
    countrycode: string
    destination: string
    stateprovince: string
    stateprovincecode: string
}

export interface nationality{
    nationality: string
    country_code: string
}

export interface buscity {
    id: number
    station_id: number
    station_name: string
}

export interface trainstation {
    location: "Chennai"
    station_code: "MSB"
    station_name: "Chennai Beach"
}

///////////////////////////////////////////

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

export class GetBusCity {
    static readonly type = '[Shared] GetBusCity';
    constructor(public city: string) {

    }
}

export class GetNationality {
    static readonly type = '[Shared] GetNationality';
    constructor(public keyword: string) {

    }
}

export class GetTrainStation {
    static readonly type = '[Shared] GetTrainStation';
    constructor(public keyword: string) {

    }
}

@State<Shared>({
    name: 'Shared',
    defaults: {
        flightCity: [],
        hotelCity: [],
        nationality: [],
        busCity: [],
        trainStation : []
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

    @Selector()
    static nationalities(state: Shared) {
        return state.nationality;
    }

    @Selector()
    static buscities(state: Shared) {
        return state.busCity;
    }

    @Selector()
    static getTrainStations(state : Shared) {
        return state.trainStation;
    }

    @Action(GetFlightCity, {cancelUncompleted: true})
    getflightCity(states: StateContext<Shared>, action: GetFlightCity) {

        return of(action.city)
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(
                    (str : string) => {
                        return from(this.sharedService.searchFlightCity(str))
                    }
                ),
                map(
                    (cities: HTTPResponse) => {
                        const parsedCity: city[] = JSON.parse(cities.data);
                        states.patchState({
                            flightCity: parsedCity
                        });
                    }
                )
            )
    }

    @Action(GetHotelCity, {cancelUncompleted: true})
    gethotelCity(states: StateContext<Shared>, action: GetHotelCity) {

        return of(action.city)
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(
                    (str: string) => {
                        return from(this.sharedService.searchHotelCity(str))
                    }
                ),
                map(
                    (cities: HTTPResponse) => {
                        const parsedCity: hotelcity[] = JSON.parse(cities.data);
                        states.patchState({
                            hotelCity: parsedCity
                        });
                    }
                )
            )
    }

    @Action(GetNationality)
    getNationality(states: StateContext<Shared>, action: GetNationality) {

        return of(action.keyword)
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(
                    (str: string) => {
                        return from(this.sharedService.getNationality(str))
                    }
                ),
                map(
                    (cities: HTTPResponse) => {
                        const nationality: nationality[] = JSON.parse(cities.data);
                        console.log(nationality);
                        states.patchState({
                            nationality: nationality
                        });
                    }
                )
            )
    }

    @Action(GetBusCity)
    getBusCity(states: StateContext<Shared>, action: GetBusCity) {
        return of(action.city)
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(
                    (str: string) => {
                        return from(this.sharedService.busCity(str))
                    }
                ),
                map(
                    (cities: HTTPResponse) => {
                        const buscity: buscity[] = JSON.parse(cities.data);
                        console.log(buscity);
                        states.patchState({
                            busCity: buscity
                        });
                    }
                )
            )
    }

    @Action(GetTrainStation)
    getTrainStation(states: StateContext<Shared>, action: GetTrainStation) {
        return of(action.keyword)
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(
                    (str: string) => {
                        return from(this.sharedService.getTrainStation(str))
                    }
                ),
                map(
                    (cities: HTTPResponse) => {
                        const station: trainstation[] = JSON.parse(cities.data);
                        console.log(station);
                        states.patchState({
                            trainStation: station
                        });
                    }
                )
            )
    }

}