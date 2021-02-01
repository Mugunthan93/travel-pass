import { State, Action, StateContext, Selector } from '@ngxs/store';
import { buscity } from '../shared.state';
import * as moment from 'moment';
import { forkJoin, from } from 'rxjs';
import { BusService } from 'src/app/services/bus/bus.service';
import { map, catchError, tap, flatMap } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { busResponse, BusResponse } from '../result/bus.state';
import { AlertController, LoadingController } from '@ionic/angular';
import { ResultMode } from '../result.state';
import { Navigate } from '@ngxs/router-plugin';


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
        private busService : BusService,
        public loadingCtrl : LoadingController,
        public alertCtrl : AlertController
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

        
        const loading$ = from(this.loadingCtrl.create({
            spinner: "crescent",
            id: 'search-hotel'
        }));

        let loadingPresent$ = loading$.pipe(
            flatMap(
                (loadingEl) => {
                    loadingEl.message = "Searching Bus....";
                    return from(loadingEl.present());
                }
            )
        );

        let loadingDismiss$ = loading$.pipe(
            flatMap(
                (loadingEl) => {
                    return from(loadingEl.dismiss());
                }
            )
        );

        const failedAlert$ = from(this.alertCtrl.create({
            header: 'Search Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    return true;
                }
            }]
        }));



        let searchPayload: buspayload = {
            'sourceCity': action.form.source.station_name,
            'destinationCity': action.form.destination.station_name,
            'doj': moment(action.form.departure).format('YYYY-MM-DD')
        };

        states.patchState({
            formdata: action.form,
            payload : searchPayload
        });

        return loadingPresent$.pipe(
            flatMap(
                () => { 
                    return this.busService.searchBus(searchPayload)
                        .pipe(
                            flatMap(
                                (response: HTTPResponse) => {
                                    const busresponse: busSearchResponse = JSON.parse(response.data);
                                    console.log(busresponse);
                                    states.dispatch(new BusResponse(busresponse.apiAvailableBuses));
                                    return loadingDismiss$
                                }
                            ),
                            map(
                                () => {
                                    states.dispatch(new ResultMode('bus'));
                                    states.dispatch(new Navigate(['/', 'home', 'result', 'bus']));
                                }
                            ),
                            catchError(
                                (error) => {
                                    console.log(error);
                                    return forkJoin(loadingDismiss$,failedAlert$).pipe(
                                        map(
                                            (alert) => {
                                                let failedAlert = alert[1];
                                                if (error.status == -4) {
                                                    failedAlert.message = "Search Timeout, Try Again";
                                                }
                                                //no result error
                                                if (error.status == 400) {
                                                    const errorString = JSON.parse(error.error);
                                                    failedAlert.message = errorString.message.response.Error.ErrorMessage;
                                                }
                                                //502 => proxy error
                                                if (error.status == 502) {
                                                    failedAlert.message = "Server failed to get correct information";
                                                }
                                                //503 => service unavailable, Maintanence downtime
                                                if (error.status == 503) {
                                                    failedAlert.message = "Server Maintanence Try again Later";
                                                }
                                                return from(failedAlert.present());
                                            }
                                        )
                                    );
                                }
                            )
                        )
                }
            )
        );


    }

}