import { State, Store, Selector, Action, StateContext } from '@ngxs/store';
import { flightResult, flightData } from 'src/app/models/search/flight';
import * as moment from "moment";
import * as _ from "lodash";
import { OneWayResultState } from './flight/oneway.state';
import { MultiCityResultState } from './flight/multi-city.state';
import { DomesticResultState } from './flight/domestic.state';
import { InternationalResultState } from './flight/international.state';
import { itineraryPayload } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { FlightService } from 'src/app/services/flight/flight.service';
import { ModalController, AlertController } from '@ionic/angular';

export interface flight {
    sort: sortButton[],
    emailtrip: emailtrip,
    emailItinerary: itinerarytrip[],
    currentSort: sortButton
}

export interface sortButton {
    label: string
    state: string
    property: string
}

export interface resultObj {
    fare: number
    refund: boolean
    name: string
    currency: string
    trips: trips[]
    seats: number
    Duration: number
    departure: string
    arrival: string
    baggage: baggage[][],
    connectingFlights: flightData[][],
    fareRule: fareRule,
    stops: number,
    email: itinerarytrip
}

export interface trips {
    from: any;
    to: any;
    departure: any;
    tripinfo: flightDetail
}

export interface flightDetail {
    logo: string,
    airline: {
        name: string,
        code: string,
        number: string
    },
    depTime: string,
    arrTime: string,
    class: string,
    duration: string,
    day:boolean,
    stops: string,
    seats: number,
    fare: number,
    currency: string
}

export interface fareRule {
    ResultIndex: string
    TraceId: string
}

export interface baggage {
    logo : string,
    originName: string,
    destinationName: string,
    baggage:string,
    cabinBaggage: string,
    
}

export interface emailtrip {
    departure: {
        name: string,
        code: string
    },
    arrival: {
        name: string,
        code: string
    }
}

export interface itinerarytrip {
    class: string,
    refundable: string,
    fare: number
    flights: itineraryFlight[]
}

export interface itineraryFlight {
    origin: {
        name: string,
        code: string
    },
    destination: {
        name: string,
        code : string
    },
    passenger_detail:string,
    connecting_flight: itineraryconnectingflight[]
}

export interface itineraryconnectingflight {
    airlineCode: string,
    airlineName: string,
    airlineNumber: string,
    origin: {
        name: string,
        code: string,
        date : string
    },
    destination: {
        name: string,
        code: string,
        date : string
    },
    duration : string
}

export interface SSR {
    Baggage: any[][] & any[]
    Error: { ErrorCode: number, ErrorMessage: string }
    MealDynamic: any[][] & any[]
    Meal: any[][] & any[]
    ResponseStatus: number
    SeatDynamic: any[]
    specialServices:any[]
    TraceId: string
}

//classes ----------------------------------------->>>>>>

export class SortChange {
    static readonly type = '[Flight] SortChange';
    constructor(public button : sortButton) {

    }
}

export class AddEmailTrips {
    static readonly type = '[Flight] AddEmailTrips';
    constructor(public emailtrip: emailtrip) {

    }
}

export class AddEmailDetail {
    static readonly type = '[Flight] AddEmailDetail';
    constructor(public flightItem: itinerarytrip) {

    }
}

export class RemoveEmailDetail {
    static readonly type = '[Flight] RemoveEmailDetail';
    constructor(public flightItem: itinerarytrip) {

    }
}

export class SendEmail {
    static readonly type = '[Flight] SendEmail';
    constructor(public itiPayload: itineraryPayload) {

    }
}

export class SortBy {
    static readonly type = "[Flight] SortBy";
    constructor(public sortby: sortButton) {

    }
}

@State<flight>({
    name: 'flight_result',
    defaults: {
        sort: [
            { label: 'departure', state: 'default', property: 'departure' },
            { label: 'arrival', state: 'default', property: 'arrival'},
            { label: 'duration', state: 'default', property: 'Duration'},
            { label: 'price', state: 'default', property: 'fare' }
        ],
        emailtrip: null,
        emailItinerary: [],
        currentSort: { label: 'departure', state: 'default', property: 'departure' }
    },
    children: [
        OneWayResultState,
        DomesticResultState,
        InternationalResultState,
        MultiCityResultState
    ]
})

export class FlightResultState{

    constructor(
        private flightService: FlightService,
        public modalCtrl: ModalController,
        public alertCtrl:AlertController
    ) {

    }

    @Selector()
    static mailStatus(states: flight): boolean {
        return states.emailItinerary.length == 0 ? false : true;
    }

    @Selector()
    static getItinerary(states: flight): itinerarytrip[] {
        return states.emailItinerary;
    }

    @Selector()
    static getemailTrip(states: flight): emailtrip {
        return states.emailtrip;
    }

    @Selector()
    static getButtons(states : flight): sortButton[] {
        return states.sort;
    }

    @Selector()
    static getSortBy(states: flight): sortButton {
        return states.currentSort;
    }


    @Action(SortChange)
    sortChange(states: StateContext<flight>, action: SortChange) {
        let currentStates: sortButton[] = states.getState().sort.map(
            (el : sortButton) => {
                if (el !== action.button) {
                    let currentstate = Object.assign({}, el);
                    currentstate.state = "default";
                    return currentstate;
                }
                else {  
                    return el;
                }
        });
        states.patchState({
            sort: currentStates,
            currentSort: action.button
        });
    }

    @Action(SortBy)
    sortBy(states: StateContext<flight>, action: SortBy) {
        let currentsort : sortButton[] = states.getState().sort;
        let sortedarray : sortButton[] = [];
        currentsort.forEach((el,ind,arr) => {
            if (el == action.sortby && action.sortby.state == 'default') {
                sortedarray[ind] = {
                    label: action.sortby.label,
                    property: action.sortby.property,
                    state: 'rotated'
                }
            }
            else if (el == action.sortby && action.sortby.state == 'rotated') {
                sortedarray[ind] = {
                    label: action.sortby.label,
                    property: action.sortby.property,
                    state: 'default'
                }
            }
            else {
                sortedarray[ind] = el;
            }
        });

        states.patchState({
            sort: sortedarray,
            currentSort : action.sortby
        });
    }

    @Action(AddEmailTrips)
    addEmailTrips(states: StateContext<flight>, action: AddEmailTrips) {
        states.patchState({
            emailtrip : action.emailtrip
        });
    }

    @Action(AddEmailDetail)
    addEmailDetail(states: StateContext<flight>, action: AddEmailDetail) {
        let emailArray = Object.assign([], states.getState().emailItinerary);
        if (emailArray == null) {
            emailArray = [];
        }
        emailArray.push(action.flightItem);
        states.patchState({
            emailItinerary: emailArray
        });
    }

    @Action(RemoveEmailDetail)
    removeEmailDetail(states: StateContext<flight>, action: RemoveEmailDetail) {
        let emailArray = Object.assign([], states.getState().emailItinerary);
        const currentArray = emailArray.filter(el => el !== action.flightItem);
        states.patchState({
            emailItinerary: currentArray
        });
    }

    @Action(SendEmail)
    async sendEmail(states: StateContext<flight>, action: SendEmail) {

        const alert = await this.alertCtrl.create({
            header: 'Mail Success',
            subHeader: 'Mail Sent',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    return true;
                }
            }]
        });

        try {
            const emailResponse = await this.flightService.emailItinerary(action.itiPayload);
            console.log(emailResponse);
            states.patchState({
                emailItinerary :[]
            });
            this.modalCtrl.dismiss();
            alert.present();
        }
        catch (error) {
            console.log(error);
        }
    }
}