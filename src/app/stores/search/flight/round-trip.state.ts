import { city } from '../../shared.state';
import { traveller } from '../flight.state';
import { flightSearchPayload, metrixBoard, flightSearchResponse } from 'src/app/models/search/flight';
import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { LoadingController, AlertController } from '@ionic/angular';
import { FlightService } from 'src/app/services/flight/flight.service';
import { ResultMode, ResultType } from '../../result.state';
import { InternationalResponse } from '../../result/flight/international.state';
import { DomesticResponse } from '../../result/flight/domestic.state';
import { BaseFlightSearch } from './filght-search';


export interface roundtripSearch {
    formData: roundTripForm,
    payload: flightSearchPayload
    metrix: metrixBoard
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
        metrix: null
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

    @Action(RoundTripForm)
    roundtripForm(states: StateContext<roundtripSearch>, action: RoundTripForm) {
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

        states.patchState({
            payload: {
                AdultCount: currentState.formData.traveller.adult.toString(),
                ChildCount: currentState.formData.traveller.child.toString(),
                InfantCount: currentState.formData.traveller.infant.toString(),
                JourneyType: this.store.selectSnapshot(state => state.FlightSearchState.getJourneyType),
                Segments: [
                    {
                        Origin: currentState.formData.from.city_code,
                        Destination: currentState.formData.to.city_code,
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: currentState.formData.departure.toJSON(),
                        PreferredDepartureTime: currentState.formData.departure.toJSON()
                    },
                    {
                        Origin: currentState.formData.to.city_code,
                        Destination: currentState.formData.from.city_code,
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: currentState.formData.return.toJSON(),
                        PreferredDepartureTime: currentState.formData.return.toJSON()
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