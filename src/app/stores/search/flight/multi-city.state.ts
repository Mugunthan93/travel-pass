import { State, Action, StateContext, Store } from '@ngxs/store';
import { flightSearchPayload, metrixBoard, segmentsPayload, flightSearchResponse } from 'src/app/models/search/flight';
import { trips, MultiCityResponse } from '../../result/flight.state';
import { traveller, FlightSearchState } from '../flight.state';
import { LoadingController, AlertController } from '@ionic/angular';
import { ResultMode, ResultType } from '../../result.state';
import { Navigate } from '@ngxs/router-plugin';


export interface multicitySearch {
    formData: multicityForm,
    payload: flightSearchPayload
    metrix: metrixBoard
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
    name: 'MultiCity',
    defaults: {
        formData: {
            trips: [],
            traveller: null,
            class: null
        },
        payload: null,
        metrix: null
    }
})

export class MultiCitySearchState{
    flightService: any;

    constructor(
        private store: Store,
        public loadingCtrl: LoadingController,
        public alertCtrl : AlertController
    ) {

    }

    @Action(MultiCityForm)
    multicityForm(states: StateContext<multicitySearch>, action: MultiCityForm) {
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

        const segs: segmentsPayload[] = [];

        currentState.formData.trips.forEach(
            (el: trips) => {
                segs.push({
                    Origin: el.from.city_code,
                    Destination: el.to.city_code,
                    FlightCabinClass: this.getCabinClass(currentState.formData.class),
                    PreferredDepartureTime: el.departure.toJSON(),
                    PreferredArrivalTime: el.departure.toJSON()
                });
            }
        );

        states.patchState({
            payload: {
                AdultCount: currentState.formData.traveller.adult.toString(),
                ChildCount: currentState.formData.traveller.child.toString(),
                InfantCount: currentState.formData.traveller.infant.toString(),
                JourneyType: this.store.selectSnapshot(state =>  state.FlightSearchState.getJourneyType),
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

        try {
            const flightResponse = await this.flightService.searchFlight(searchData.payload);
            console.log(flightResponse);
            const data: flightSearchResponse = JSON.parse(flightResponse.data);
            this.store.dispatch(new MultiCityResponse(data.response));

            this.store.dispatch(new ResultMode('Flight'));
            this.store.dispatch(new ResultType('multi-city'));
            loading.dismiss();
            this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'multi-city']));
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

    getCabinClass(cls: string) {
        if (cls == "all") {
            return "1";
        }
        if (cls == "economy") {
            return "2";
        }
        else if (cls == "premium economy") {
            return "3";
        }
        else if (cls == "bussiness") {
            return "4";
        }
        else if (cls == "first class") {
            return "6";
        }
    }

}