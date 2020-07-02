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
    static getTravelDate(states: roundtripSearch): string {
        return moment(states.formData.departure).format('YYYY-MM-DDThh:mm:ss');
    }

    @Selector()
    static getReturnDate(states: roundtripSearch): string {
        return moment(states.formData.return).format('YYYY-MM-DDThh:mm:ss');
    }

    @Selector()
    static getPayloadTravelDate(states: roundtripSearch): string {
        return moment(states.formData.departure).format('YYYY-MM-DD');
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
                handler: (res) => {
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
        let departureTime = typeof currentState.formData.departure == 'string' ? currentState.formData.departure : currentState.formData.departure.toJSON();
        let returnTime = typeof currentState.formData.return == 'string' ? currentState.formData.return : currentState.formData.return.toJSON();


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
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: departureTime,
                        PreferredDepartureTime: departureTime
                    },
                    {
                        Origin: currentState.formData.to.city_code,
                        Destination: currentState.formData.from.city_code,
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: returnTime,
                        PreferredDepartureTime: returnTime
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

        try {
            const flightResponse = await this.flightService.searchFlight(searchData.payload);
            console.log(flightResponse);
            const data: flightSearchResponse = JSON.parse(flightResponse.data);
            console.log(data);
            this.store.dispatch(new ResultMode('Flight'));
            if (data.response.Results.length == 1) {
                this.store.dispatch(new ResultType('round-trip'));
                this.store.dispatch(new InternationalResponse(data.response));
            }
            else if (data.response.Results.length == 2) {
                this.store.dispatch(new ResultType('animated-round-trip'));
                this.store.dispatch(new DomesticResponse (data.response));

            }
            console.log(flightResponse);

            loading.dismiss();
        }
        catch (error) {
            console.log(error);
            //no reesult error
            if (error.status == 400) {
                const errorString = JSON.parse(error.error);
                failedAlert.message = errorString.message.response.Error.ErrorMessage;
                loading.dismiss();
                failedAlert.present();
            }
            //502 => proxy error
            if (error.status == 502) {
                failedAlert.message = "Server failed to get correct information";
                loading.dismiss();
                failedAlert.present();
            }
            //503 => service unavailable, Maintanence downtime
            if (error.status == 503) {
                failedAlert.message = "Server Maintanence Try again Later";
                loading.dismiss();
                failedAlert.present();
            }
        }


    }

}