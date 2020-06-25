import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { flightSearchPayload, metrixBoard, flightSearchResponse } from 'src/app/models/search/flight';
import { LoadingController, AlertController } from '@ionic/angular';
import { city } from '../../shared.state';
import { traveller, FlightSearchState } from '../flight.state';
import { FlightService } from 'src/app/services/flight/flight.service';
import { ResultMode, ResultType } from '../../result.state';
import { Navigate } from '@ngxs/router-plugin';
import { OneWayResponse } from '../../result/flight.state';

export interface onewaySearch {
    formData: oneWayForm,
    payload: flightSearchPayload
    metrix: metrixBoard
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
    name: 'OneWay',
    defaults: {
        formData: {
            from: null,
            to: null,
            departure: null,
            traveller: null,
            class: null
        },
        payload: null,
        metrix: null
    }
})

export class OneWaySearchState {

    constructor(
        private store : Store,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private flightService : FlightService
    ) {
    }

    @Selector()
    static getAdult(states: onewaySearch): string {
        return states.payload.AdultCount
    }

    @Selector()
    static getChild(states: onewaySearch): string {
        return states.payload.ChildCount
    }

    @Selector()
    static getInfant(states: onewaySearch): string {
        return states.payload.InfantCount
    }

    @Action(OneWayForm)
    onewayForm(states: StateContext<onewaySearch>, action: OneWayForm) {
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
                JourneyType: this.store.selectSnapshot<number>(FlightSearchState.getJourneyType),
                Segments: [
                    {
                        Origin: currentState.formData.from.city_code,
                        Destination: currentState.formData.to.city_code,
                        FlightCabinClass: this.getCabinClass(currentState.formData.class),
                        PreferredArrivalTime: currentState.formData.departure.toJSON(),
                        PreferredDepartureTime: currentState.formData.departure.toJSON()
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
            this.store.dispatch(new OneWayResponse(data.response));
            console.log(data);

            this.store.dispatch(new ResultMode('Flight'));
            this.store.dispatch(new ResultType('one-way'));
            loading.dismiss();
            this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'one-way']));

        }
        catch (error) {
            console.log(error);
            if (error.status == -4) {
                failedAlert.message = "Search Timeout, Try Again";
                loading.dismiss();
                failedAlert.present();
            }
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