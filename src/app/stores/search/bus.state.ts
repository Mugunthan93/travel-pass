import { State, Action, StateContext, Selector } from '@ngxs/store';
import { buscity } from '../shared.state';
import * as moment from 'moment';
import { from, of, throwError } from 'rxjs';
import { BusService } from 'src/app/services/bus/bus.service';
import { map, catchError, tap } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { busResponse, BusResponse } from '../result/bus.state';


export interface bussearch {
    formdata: busform
    payload: buspayload
}

export interface busform {
    source: buscity
    destination: buscity
    departure: Date
    return: Date
    seat: number
}

export interface buspayload {
    sourceCity: string
    destinationCity: string
    doj:string
}

export interface busSearchResponse {
    apiAvailableBuses: busResponse[]
    apiStatus: {
        message: string
        success : boolean
    }
}


////////////////////////////////////////////////////////////

export class SearchBus {
    static readonly type = "[bus_search] SearchBus";
    constructor(public form: busform) {

    }
}


@State<bussearch>({
    name: 'bus_search',
    defaults: {
        formdata: null,
        payload: null
    }
})

export class BusSearchState {

    constructor(
        private busService : BusService
    ) {
        
    }

    @Selector()
    static getSearchData(state: bussearch) {
        return state.formdata;
    }

    @Selector()
    static getPayload(state : bussearch) {
        return state.payload;
    }

    @Selector()
    static getPassengersCount(state: bussearch) {
        return state.formdata.seat
    }

    @Action(SearchBus)
    searchBus(states: StateContext<bussearch>, action: SearchBus) {

        let searchPayload: buspayload = {
            'sourceCity': action.form.source.station_name,
            'destinationCity': action.form.destination.station_name,
            'doj': moment(action.form.departure).format('YYYY-MM-DD')
        };

        states.patchState({
            formdata: action.form,
            payload : searchPayload
        });

        return this.busService.searchBus(searchPayload)
            .pipe(
                tap(
                    (response: HTTPResponse) => {
                        const busresponse: busSearchResponse = JSON.parse(response.data);
                        console.log(busresponse);
                        states.dispatch(new BusResponse(busresponse.apiAvailableBuses));
                    }
                ),
                catchError(
                    (err) => {
                        console.log(err);
                        return of(err);
                    }
                )
            )

    }

}