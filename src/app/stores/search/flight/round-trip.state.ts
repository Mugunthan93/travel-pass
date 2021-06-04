import { city } from '../../shared.state';
import { traveller, FlightSearchState } from '../flight.state';
import { flightSearchPayload, metrixBoard, flightSearchResponse } from 'src/app/models/search/flight';
import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { LoadingController, AlertController } from '@ionic/angular';
import { FlightService } from 'src/app/services/flight/flight.service';
import { ResultMode, ResultType } from '../../result.state';
import { InternationalResponse } from '../../result/flight/international.state';
import { DomesticResponse } from '../../result/flight/domestic.state';
import { BaseFlightSearch } from './filght-search';
import * as moment from 'moment';
import { ChangeFlightType } from '../../result/flight.state';
import { Injectable } from '@angular/core';


export interface roundtripSearch {
    formData: roundTripForm,
    payload: flightSearchPayload
    metrix: metrixBoard
    tripType: 'domestic' | 'international' | null
}

export interface roundTripForm {
    from: city
    to: city
    departure: Date
    return: Date
    traveller: traveller
    class: string
}

export class RoundTripForm {
    static readonly type = "[RoundTrip] RoundTripForm";
    constructor(public flightform: roundTripForm) {
    }
}

export class RoundTripSearch {
    static readonly type = "[RoundTrip] RoundTripSearch";
}

@State<roundtripSearch>({
    name: 'roundtrip_search',
    defaults: {
        formData: {
            from: null,
            to: null,
            departure: null,
            return: null,
            traveller: null,
            class: null
        },
        payload: null,
        metrix: null,
        tripType: null
    }
})

@Injectable()
export class RoundTripSearchState extends BaseFlightSearch {

    constructor(
        private store : Store,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public flightService : FlightService
    ) {

        super();
    }

    @Selector()
    static getAdult(states: roundtripSearch): number {
        return states.formData.traveller.adult;
    }

    @Selector()
    static getFromValue(states: roundtripSearch) {
        return states.formData.from;
    }

    @Selector()
    static getToValue(states: roundtripSearch) {
        return states.formData.to;
    }

    @Selector()
    static getTripType(states: roundtripSearch): string {
        return states.tripType;
    }

    @Selector()
    static getTripClass(states: roundtripSearch): string {
        return states.formData.class.toLowerCase();
    }


    @Selector()
    static getTravelDate(states: roundtripSearch): string {
        return moment(states.formData.departure).format('YYYY-MM-DDThh:mm:ss');
    }

    @Selector()
    static getReturnDate(states: roundtripSearch): string {
        return moment(states.formData.return).format('YYYY-MM-DDThh:mm:ss');
    }

    @Selector()
    static getPayloadDepartureTravelDate(states: roundtripSearch): string {
        return moment(states.formData.departure).format('YYYY-MM-DD');
    }

    @Selector()
    static getPayloadReturnTravelDate(states: roundtripSearch): string {
        return moment(states.formData.return).format('YYYY-MM-DD');
    }

    @Selector()
    static getTripRequest(states: roundtripSearch): flightSearchPayload {
        return states.payload;
    }

    @Action(RoundTripForm)
    roundtripForm(states: StateContext<roundtripSearch>, action: RoundTripForm) {

        if (action.flightform.from.country_code == action.flightform.to.country_code) {
            states.patchState({
                tripType: 'domestic'
            })
        }
        else if (action.flightform.from.country_code != action.flightform.to.country_code) {
            states.patchState({
                tripType: 'international'
            })
        }

        states.patchState({
            formData : action.flightform
        })
    }


    @Action(RoundTripSearch)
    async roundtripSearch(states: StateContext<roundtripSearch>) {

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

        states.patchState({
            payload: {
                AdultCount: currentState.formData.traveller.adult.toString(),
                ChildCount: currentState.formData.traveller.child.toString(),
                InfantCount: currentState.formData.traveller.infant.toString(),
                JourneyType: this.store.selectSnapshot(FlightSearchState.getJourneyType),
                Segments: [
                    {
                        Origin: currentState.formData.from.city_code,
                        Destination: currentState.formData.to.city_code,
                        OriginName: currentState.formData.from.city_name,
                        DestinationName: currentState.formData.to.city_name,
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: moment(currentState.formData.departure).format('YYYY-MM-DDTHH:mm:ss'),
                        PreferredDepartureTime: moment(currentState.formData.departure).format('YYYY-MM-DDTHH:mm:ss')
                    },
                    {
                        Origin: currentState.formData.to.city_code,
                        Destination: currentState.formData.from.city_code,
                        OriginName: currentState.formData.to.city_name,
                        DestinationName: currentState.formData.from.city_name,
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: moment(currentState.formData.return).format('YYYY-MM-DDTHH:mm:ss'),
                        PreferredDepartureTime: moment(currentState.formData.return).format('YYYY-MM-DDTHH:mm:ss')
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

        console.log(JSON.stringify(searchData.payload));

        try {
            const flightResponse = await this.flightService.searchFlight(searchData.payload);
            console.log(JSON.stringify(flightResponse));
            const data: flightSearchResponse = JSON.parse(flightResponse.data);
            console.log(data);
            this.store.dispatch(new ResultMode('flight'));
            if (data.response.Results.length == 1) {
                this.store.dispatch(new ResultType('round-trip'));
                this.store.dispatch(new InternationalResponse(data.response));
            }
            else if (data.response.Results.length == 2) {
                this.store.dispatch(new ResultType('animated-round-trip'));
                states.dispatch(new ChangeFlightType('departure'));
                this.store.dispatch(new DomesticResponse (data.response));

            }
            console.log(flightResponse);

            loading.dismiss();
        }
        catch (error) {
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
