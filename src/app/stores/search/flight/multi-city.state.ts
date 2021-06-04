import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { flightSearchPayload, metrixBoard, segmentsPayload, flightSearchResponse } from 'src/app/models/search/flight';
import { trips } from '../../result/flight.state';
import { traveller, FlightSearchState } from '../flight.state';
import { LoadingController, AlertController } from '@ionic/angular';
import { ResultMode, ResultType } from '../../result.state';
import { Navigate } from '@ngxs/router-plugin';
import { FlightService } from 'src/app/services/flight/flight.service';
import { MultiCityResponse } from '../../result/flight/multi-city.state';
import { BaseFlightSearch } from './filght-search';
import * as moment from 'moment';
import { Injectable } from '@angular/core';


export interface multicitySearch {
    formData: multicityForm,
    payload: flightSearchPayload
    metrix: metrixBoard,
    tripType: 'domestic' | 'international' | null
}


export interface multicityForm {
    trips: trips[]
    traveller: traveller
    class: string
}

export class MultiCityForm {
    static readonly type = "[MultiCity] MulticityForm";
    constructor(public flightform: multicityForm) {
    }
}

export class MultiCitySearch {
    static readonly type = "[MultiCity] MulticitySearch";
}

@State<multicitySearch>({
    name: 'multicity_search',
    defaults: {
        formData: {
            trips: [],
            traveller: null,
            class: null
        },
        payload: null,
        metrix: null,
        tripType: null
    }
})

@Injectable()
export class MultiCitySearchState extends BaseFlightSearch {

    constructor(
        private store: Store,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private flightService : FlightService
    ) {
        super();
    }

    @Selector()
    static getFromValue(states: multicitySearch) {
        return states.formData.trips[0].from;
    }

    @Selector()
    static getToValue(states: multicitySearch) {
        return states.formData.trips[states.formData.trips.length - 1].to;
    }

    @Selector()
    static getTripType(states: multicitySearch): string {
        return states.tripType;
    }

    @Selector()
    static getTripClass(states: multicitySearch): string {
        return states.formData.class.toLowerCase();
    }


    @Selector()
    static getTravelDate(states: multicitySearch): string {
        return moment(states.formData.trips[0].departure).format('YYYY-MM-DDThh:mm:ss');
    }

    @Selector()
    static getPayloadTravelDate(states: multicitySearch): string {
        return moment(states.formData.trips[0].departure).format('YYYY-MM-DD');
    }

    @Selector()
    static getTripRequest(states: multicitySearch): flightSearchPayload {
        return states.payload;
    }

    @Selector()
    static getAdult(states: multicitySearch): number {
        return states.formData.traveller.adult;
    }

    @Action(MultiCityForm)
    multicityForm(states: StateContext<multicitySearch>, action: MultiCityForm) {

        action.flightform.trips.forEach(
            el => {
                if (el.from.country_code == el.to.country_code) {
                    states.patchState({
                        tripType: 'domestic'
                    })
                }
                else if (el.from.country_code != el.to.country_code) {
                    states.patchState({
                        tripType: 'international'
                    })
                }
        });
        states.patchState({
            formData : action.flightform
        });
    }


    @Action(MultiCitySearch)
    async multicitySearch(states: StateContext<multicitySearch>) {

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

        const segs: segmentsPayload[] = [];

        currentState.formData.trips.forEach(
            (el: trips) => {
                segs.push({
                    Origin: el.from.city_code,
                    Destination: el.to.city_code,
                    FlightCabinClass: this.getCabinClass(currentState.formData.class),
                    OriginName: el.from.city_name,
                    DestinationName: el.to.city_name,
                    PreferredDepartureTime: moment(el.departure).format('YYYY-MM-DDTHH:mm:ss'),
                    PreferredArrivalTime: moment(el.departure).format('YYYY-MM-DDTHH:mm:ss')
                });
            }
        );

        states.patchState({
            payload: {
                AdultCount: currentState.formData.traveller.adult.toString(),
                ChildCount: currentState.formData.traveller.child.toString(),
                InfantCount: currentState.formData.traveller.infant.toString(),
                JourneyType: this.store.selectSnapshot(FlightSearchState.getJourneyType),
                Segments: segs,
                prefferedAirline: [null],
                sources: ['']
            },
            metrix: {
                sector: {
                    Destination: currentState.formData.trips[0].to.city_code,
                    Origin: currentState.formData.trips[0].from.city_code
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
            console.log(flightResponse);
            const data: flightSearchResponse = JSON.parse(flightResponse.data);
            this.store.dispatch(new MultiCityResponse(data.response));

            this.store.dispatch(new ResultMode('flight'));
            this.store.dispatch(new ResultType('multi-city'));
            loading.dismiss();
            this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'multi-city']));
        }
        catch (error) {
            console.log(error);
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
            //     console.log(JSON.stringify(error));
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
