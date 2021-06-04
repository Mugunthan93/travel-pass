import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { flightSearchPayload, metrixBoard, flightSearchResponse } from 'src/app/models/search/flight';
import { LoadingController, AlertController } from '@ionic/angular';
import { city } from '../../shared.state';
import { traveller, FlightSearchState } from '../flight.state';
import { FlightService } from 'src/app/services/flight/flight.service';
import { ResultMode, ResultType } from '../../result.state';
import { Navigate } from '@ngxs/router-plugin';
import { OneWayResponse } from '../../result/flight/oneway.state';
import { BaseFlightSearch } from './filght-search';
import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';

export interface onewaySearch {
    formData: oneWayForm,
    payload: flightSearchPayload
    metrix: metrixBoard
    tripType:'domestic' | 'international' | null
}

export interface oneWayForm {
    from: city
    to: city
    departure: Date
    traveller: traveller
    class: string
}

export class OneWayForm {
    static readonly type = "[OneWay] OneWayForm";
    constructor(public flightform: oneWayForm) {
    }
}

export class OneWaySearch {
    static readonly type = "[OneWay] OneWaySearch";
}

@State<onewaySearch>({
    name: 'oneway_search',
    defaults: {
        formData: {
            from: null,
            to: null,
            departure: null,
            traveller: null,
            class: null
        },
        payload: null,
        metrix: null,
        tripType:null
    }
})

@Injectable()
export class OneWaySearchState extends BaseFlightSearch{

    constructor(
        private store : Store,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private flightService : FlightService,
        private sharedService : SharedService
    ) {

        super();
    }

    @Selector()
    static getFromValue(states: onewaySearch) {
        return states.formData.from;
    }

    @Selector()
    static getToValue(states: onewaySearch) {
        return states.formData.to;
    }

    @Selector()
    static getTripType(states: onewaySearch): string {
        return states.tripType;
    }

    @Selector()
    static getTripClass(states: onewaySearch): string {
        return states.formData.class.toLowerCase();
    }


    @Selector()
    static getTravelDate(states: onewaySearch): string {
        return moment(states.formData.departure).format('YYYY-MM-DDThh:mm:ss');
    }

    @Selector()
    static getPayloadTravelDate(states: onewaySearch): string {
        return moment(states.formData.departure).format('YYYY-MM-DD');
    }

    @Selector()
    static getTripRequest(states: onewaySearch): flightSearchPayload {
        return states.payload;
    }

    @Selector()
    static getAdult(states: onewaySearch): number {
        return states.formData.traveller.adult;
    }

    @Action(OneWayForm)
    onewayForm(states: StateContext<onewaySearch>, action: OneWayForm) {

        if (action.flightform.from.country_code == action.flightform.to.country_code)
        {
            states.patchState({
                tripType : 'domestic'
            })
        }
        else if (action.flightform.from.country_code != action.flightform.to.country_code) {
            states.patchState({
                tripType: 'international'
            })
        }

        states.patchState({
            formData: action.flightform
        });
    }


    @Action(OneWaySearch)
    async onewaySearch(states: StateContext<onewaySearch>) {

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Search Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    failedAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                }
            }]
        });

        loading.message = "Searching Flight...";
        await loading.present();

        let currentState = states.getState();
        let token = JSON.parse((await this.sharedService.getToken()).data).TokenId

        states.patchState({
            payload: {
                EndUserIp : "192.168.10.10",
                TokenId: token,
                AdultCount: currentState.formData.traveller.adult.toString(),
                ChildCount: currentState.formData.traveller.child.toString(),
                InfantCount: currentState.formData.traveller.infant.toString(),
                JourneyType: this.store.selectSnapshot<number>(FlightSearchState.getJourneyType),
                Segments: [
                    {
                        Origin: currentState.formData.from.city_code,
                        Destination: currentState.formData.to.city_code,
                        OriginName:currentState.formData.from.city_name,
                        DestinationName:currentState.formData.to.city_name,
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: moment(currentState.formData.departure).format('YYYY-MM-DDTHH:mm:ss'),
                        PreferredDepartureTime: moment(currentState.formData.departure).format('YYYY-MM-DDTHH:mm:ss')
                    }
                ],
                prefferedAirline: [null],
                sources: ['']
            },
            metrix: {
                sector: {
                    Destination: currentState.formData.to.city_code,
                    Origin: currentState.formData.from.city_code
                },
                type_of_booking: "airline"
            }
        });

        const metrixData = states.getState();
        try {
            const metrixboardResponse = await this.flightService.metrixboard(metrixData.metrix);
            console.log(metrixboardResponse);
            const data = JSON.parse(metrixboardResponse.data);
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }

        const searchData = states.getState();
        console.log(searchData);
        try {
            console.log(JSON.stringify(searchData.payload));
            const flightResponse = await this.flightService.searchFlight(searchData.payload);
            console.log(JSON.stringify(flightResponse));
            const data: flightSearchResponse = JSON.parse(flightResponse.data);


            this.store.dispatch(new OneWayResponse(data.response));
            console.log(data);

            states.dispatch(new ResultMode('flight'));
            states.dispatch(new ResultType('one-way'));
            await loading.dismiss();
            states.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'one-way']));

        }
        catch (error) {
            console.log(error);
            console.log(JSON.stringify(error));
            if (error.status == -4) {
                failedAlert.message = "Search Timeout, Try Again";
            }
            //no reesult error
            else if (error.status == 400) {
                const errorString = JSON.parse(error.error);
                failedAlert.message = errorString.message.response.Error.ErrorMessage;
            }
            // //502 => proxy error
            // else if (error.status == 502) {
            //     failedAlert.message = "Server failed to get correct information";
            // }
            // //503 => service unavailable, Maintanence downtime
            // else if (error.status == 503) {
            //     failedAlert.message = "Server Maintanence Try again Later";
            // }
            else {
              failedAlert.message = "Result Not Found Kindly search again later";
            }
            loading.dismiss();
            failedAlert.present();
        }

    }

}
