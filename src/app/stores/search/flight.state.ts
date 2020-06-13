import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { metrixBoard, flightSearchPayload, segmentsPayload, flightSearchResponse } from 'src/app/models/search/flight';
import { city } from '../shared.state';
import { FlightService } from 'src/app/services/flight/flight.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { OneWayResponse, RoundTripResponse, MultiCityResponse } from '../result/flight.state';
import { ResultType, ResultMode } from '../result.state';

//interfaces

export interface flight{
    JourneyType: number
    onewaySearch: flightSearchPayload
    roundtripSearch: flightSearchPayload
    multicitySearch: flightSearchPayload
    metrixpayload: metrixBoard
}

export interface oneWayForm {
    from: city
    to: city
    departure: Date
    traveller: traveller
    class: string
}

export interface roundTripForm{
    from: city
    to: city
    departure: Date
    return: Date
    traveller: traveller
    class: string
}

export interface multicityForm{
    trips: trips[]
    traveller: traveller
    class: string
}

export interface trips {
    from: city
    to: city
    departure: Date
}

export interface traveller {
    child: number
    infant: number
    adult: number
}


//class

export class JourneyType {
    static readonly type = "[Flight] FlightType";
    constructor(public type : string) {

    }
}

export class OneWaySearch {
    static readonly type = "[FlightSearch] OneWaySearch";
    constructor(public flightPayload: oneWayForm) {
    }
}

export class RoundTripSearch {
    static readonly type = "[FlightSearch] RoundTripSearch";
    constructor(public flightPayload: roundTripForm) {
    }
}

export class MulticitySearch {
    static readonly type = "[FlightSearch] MulticitySearch";
    constructor(public flightPayload: multicityForm) {
    }
}

@State<flight>({
    name: 'FlightSearch',
    defaults: {
        JourneyType: null,
        onewaySearch: null,
        roundtripSearch: null,
        multicitySearch: null,
        metrixpayload: null
    }
})
export class FlightSearchState {

    constructor(
        private flightService: FlightService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private store: Store
    ) {

    }

    @Selector()
    static getJourneyType(states: flight) : number {
        return states.JourneyType;
    }

    @Action(JourneyType)
    journeyType(states: StateContext<flight>, action: JourneyType) {
        if (action.type == "one-way") {
            states.patchState({
                JourneyType : 1
            });
        }
        else if (action.type == "round-trip") {
            states.patchState({
                JourneyType: 2
            });
        }
        else if (action.type == "multi-city") {
            states.patchState({
                JourneyType: 3
            });
        }
    }

    @Action(OneWaySearch)
    async OnewaySearch(states: StateContext<flight>, action: OneWaySearch) {

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
            onewaySearch: {
                AdultCount: action.flightPayload.traveller.adult.toString(),
                ChildCount: action.flightPayload.traveller.child.toString(),
                InfantCount: action.flightPayload.traveller.infant.toString(),
                JourneyType: currentState.JourneyType,
                Segments: [
                    {
                        Origin: action.flightPayload.from.city_code,
                        Destination: action.flightPayload.to.city_code,
                        FlightCabinClass: this.getCabinClass(action.flightPayload.class),
                        PreferredArrivalTime: action.flightPayload.departure.toJSON(),
                        PreferredDepartureTime: action.flightPayload.departure.toJSON()
                    }
                ],
                prefferedAirline: [null],
                sources: ['']
            },
            metrixpayload: {
                sector: {
                    Destination: action.flightPayload.to.city_code,
                    Origin: action.flightPayload.from.city_code
                },
                type_of_booking: "airline"
            }
        });


        const metrixData = states.getState();
        try {
            const metrixboardResponse = await this.flightService.metrixboard(metrixData.metrixpayload);
            console.log(metrixboardResponse);
            const data = JSON.parse(metrixboardResponse.data);
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }

        const searchData = states.getState();

        try {
            const flightResponse = await this.flightService.searchFlight(searchData.onewaySearch);
            console.log(flightResponse);
            const data: flightSearchResponse = JSON.parse(flightResponse.data);
            this.store.dispatch(new OneWayResponse(data.response));
            console.log(data);

            this.store.dispatch(new ResultMode('flight'));
            this.store.dispatch(new ResultType('one-way'));
            loading.dismiss();
            this.store.dispatch(new Navigate(['/', 'home', 'result', 'flight', 'one-way']));

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

    @Action(RoundTripSearch)
    async RoundtripSearch(states: StateContext<flight>, action: RoundTripSearch) {

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
            roundtripSearch: {
                AdultCount: action.flightPayload.traveller.adult.toString(),
                ChildCount: action.flightPayload.traveller.child.toString(),
                InfantCount: action.flightPayload.traveller.infant.toString(),
                JourneyType: currentState.JourneyType,
                Segments: [
                    {
                        Origin: action.flightPayload.from.city_code,
                        Destination: action.flightPayload.to.city_code,
                        FlightCabinClass: this.getCabinClass(action.flightPayload.class),
                        PreferredArrivalTime: action.flightPayload.departure.toJSON(),
                        PreferredDepartureTime: action.flightPayload.departure.toJSON()
                    },
                    {
                        Origin: action.flightPayload.to.city_code,
                        Destination: action.flightPayload.from.city_code,
                        FlightCabinClass: this.getCabinClass(action.flightPayload.class),
                        PreferredArrivalTime: action.flightPayload.return.toJSON(),
                        PreferredDepartureTime: action.flightPayload.return.toJSON()
                    }
                ],
                prefferedAirline: [null],
                sources: ['']
            },
            metrixpayload: {
                sector: {
                    Destination: action.flightPayload.to.city_code,
                    Origin: action.flightPayload.from.city_code
                },
                type_of_booking: "airline"
            }
        });


        const metrixData = states.getState();
        try {
            const metrixboardResponse = await this.flightService.metrixboard(metrixData.metrixpayload);
            console.log(metrixboardResponse);
            const data = JSON.parse(metrixboardResponse.data);
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }

        const searchData = states.getState();

        try {
            const flightResponse = await this.flightService.searchFlight(searchData.roundtripSearch);
            console.log(flightResponse);
            const data: flightSearchResponse = JSON.parse(flightResponse.data);
            console.log(data);
            this.store.dispatch(new ResultMode('flight'));
            if (data.response.Results.length == 1) { 
                this.store.dispatch(new ResultType('round-trip'));
            }
            else if (data.response.Results.length == 2) {
                this.store.dispatch(new ResultType('animated-round-trip'));
            }
            this.store.dispatch(new RoundTripResponse(data.response));
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

    @Action(MulticitySearch)
    async MulticitySearch(states: StateContext<flight>, action: MulticitySearch) {

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

        action.flightPayload.trips.forEach(
            (el : trips) => {
                segs.push({
                    Origin: el.from.city_code,
                    Destination: el.to.city_code,
                    FlightCabinClass: this.getCabinClass(action.flightPayload.class),
                    PreferredDepartureTime: el.departure.toJSON(),
                    PreferredArrivalTime: el.departure.toJSON()
                });
            }
        );

        states.patchState({
            multicitySearch: {
                AdultCount: action.flightPayload.traveller.adult.toString(),
                ChildCount: action.flightPayload.traveller.child.toString(),
                InfantCount: action.flightPayload.traveller.infant.toString(),
                JourneyType: currentState.JourneyType,
                Segments: segs,
                prefferedAirline: [null],
                sources: ['']
            },
            metrixpayload: {
                sector: {
                    Destination: action.flightPayload.trips[0].to.city_code,
                    Origin: action.flightPayload.trips[0].from.city_code
                },
                type_of_booking: "airline"
            }
        });


        const metrixData = states.getState();
        try {
            const metrixboardResponse = await this.flightService.metrixboard(metrixData.metrixpayload);
            console.log(metrixboardResponse);
            const data = JSON.parse(metrixboardResponse.data);
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }

        const searchData = states.getState();

        try {
            const flightResponse = await this.flightService.searchFlight(searchData.multicitySearch);
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

    getCabinClass(cls : string) {
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