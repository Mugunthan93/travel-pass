import { State, Selector, Action, Store, StateContext } from '@ngxs/store';
import { FLightBookState } from './book/flight.state';
import { HotelBookState, HotelOfflineRequest, HotelRequest } from './book/hotel.state';
import { BusBookState, BusRequest } from './book/bus.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { TrainBookState } from './book/train.state';
import { TrainOneWayRequest } from './book/train/one-way.state';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { BookOneWayTicket, FlightOneWaySendRequest, OneWayBookState, OneWayOfflineRequest } from './book/flight/oneway.state';
import { InternationalBookState, InternationalOfflineRequest, InternationalSendRequest, InternationalTicket } from './book/flight/international.state';
import { DomesticBookState, DomesticOfflineRequest, DomesticSendRequest, DomesticTicket } from './book/flight/domestic.state';
import { MultiCityBookState, MultiCityOfflineRequest, MultiCitySendRequest } from './book/flight/multi-city.state';
import { TrainRoundTripRequest } from './book/train/round-trip.state';
import { TrainMultiCityRequest } from './book/train/multi-city.state';
import { from } from 'rxjs/internal/observable/from';
import { flatMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import { SearchState } from './search.state';
import { ResultState } from './result.state';
import { AgencyState, SetAgency } from './agency.state';
import { SetVendor, VendorState } from './vendor.state';
import { CompanyState } from './company.state';
import { Injectable } from '@angular/core';
import { SendCabOfflineRequest } from './search/cab.state';

export interface book {
    mode: string,
    type: string,
    mail: string[]
    purpose: string
    comment: string
}

export class BookType {
    static readonly type = "[book] BookType"
    constructor(public type : string) {

    }
}

export class BookMode {
    static readonly type = "[book] BookMode"
    constructor(public mode: string) {

    }
}

export class MailCC {
    static readonly type = "[book] MailCC";
    constructor(public mail: string[]) {

    }
}

export class Purpose {
    static readonly type = "[book] Purpose";
    constructor(public purpose: string) {

    }
}

export class Comments {
    static readonly type = "[book] Comment";
    constructor(public comment: string) {

    }
}

export class SendRequest {
    static readonly type = "[book] SendRequest";
}

export class BookBack {
    static readonly type = "[book] BookBack"
}

export class BookTicket {
    static readonly type = "[book] BookTicket"
}

export class OfflineRequest {
    static readonly type = "[book] OfflineRequest";
}

@State<book>({
    name: 'Book',
    defaults: {
        mode: null,
        type: null,
        mail: [],
        purpose: null,
        comment: null
    },
    children: [
        BusBookState,
        FLightBookState,
        HotelBookState,
        TrainBookState
    ]
})

@Injectable()
export class BookState {

    @Selector()
    static getBookMode(state: book) {
        return state.mode;
    }

    @Selector()
    static getBookType(state: book) {
        return state.type;
    }

    constructor(
        private store: Store,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController
    ) {

    }

    @Action(BookType)
    bookType(states: StateContext<book>, action: BookType) {
        states.patchState({
            type: action.type
        });

    }


    @Action(BookMode)
    bookMode(states: StateContext<book>, action: BookMode) {
        states.patchState({
            mode: action.mode
        });
    }

    @Action(MailCC)
    mailCC(states: StateContext<book>, action: MailCC) {
        states.patchState({
            mail: action.mail
        });
    }

    @Action(Purpose)
    purpose(states: StateContext<book>, action: Purpose) {
        states.patchState({
            purpose: action.purpose
        });
    }

    @Action(Comments)
    comment(states: StateContext<book>, action: Comments) {
        states.patchState({
            comment: action.comment
        });
    }

    @Action(SendRequest)
    sendRequest(states: StateContext<book>) {

        this.modalCtrl.dismiss(null, null,'book-confirm');
        let mode = states.getState().mode;
        let type = states.getState().type;

        let comment = states.getState().comment;
        let mailCC = states.getState().mail;
        let purpose = states.getState().purpose;

        if (mode == 'flight') {
            if (type == 'one-way') {
                states.dispatch(new FlightOneWaySendRequest(comment, mailCC, purpose));
            }
            else if (type == 'round-trip') {
                states.dispatch(new InternationalSendRequest(comment, mailCC, purpose));
            }
            else if (type == 'animated-round-trip') {
                states.dispatch(new DomesticSendRequest(comment, mailCC, purpose));
            }
            else if (type == 'multi-city') {
                states.dispatch(new MultiCitySendRequest(comment, mailCC, purpose));
            }
        }
        else if (mode == 'hotel') {
            states.dispatch(new HotelRequest(comment, mailCC, purpose))
        }
        else if (mode == 'bus') {
            states.dispatch(new BusRequest(comment, mailCC, purpose));
        }
        else if (mode == 'train') {
            if (type == 'one-way') {
                states.dispatch(new TrainOneWayRequest(comment,mailCC,purpose));
            }
            else if (type == 'round-trip') {
                states.dispatch(new TrainRoundTripRequest(comment,mailCC,purpose));
            }
            else if (type == 'multi-city') {
               states.dispatch(new TrainMultiCityRequest(comment,mailCC,purpose));
            }
        }
    }

    @Action(BookBack)
    bookback(states: StateContext<book>) {
        let bookMode: string = states.getState().mode;
        let bookType: string = states.getState().type;

        if (bookMode == 'flight') {
            if (bookType == 'animated-round-trip') {
                states.dispatch(new Navigate(['/', 'home', 'result', bookMode, 'round-trip','domestic']));
            }
            else if(bookType == 'round-trip'){
                states.dispatch(new Navigate(['/', 'home', 'result', bookMode, bookType,'international']));
            }
            else {
                states.dispatch(new Navigate(['/', 'home', 'result', bookMode, bookType]));
            }
        }
        else if (bookMode == 'train' || bookMode == 'cab') {
            states.dispatch(new Navigate(['/', 'home', 'search', bookMode, bookType]));
        }
        else {
            states.dispatch(new Navigate(['/', 'home', 'result', bookMode]));
        }
        states.dispatch(new StateReset(BookState));
    }

    @Action(BookTicket)
    bookTicket(states: StateContext<book>) {

        this.modalCtrl.dismiss(null, null,'book-confirm');
        let mode = states.getState().mode;
        let type = states.getState().type;

        let failedAlert$ = from(this.alertCtrl.create({
            header: 'Booking Failed',
            message : "We couldn't process your request due to some technical issue. Please contact Your Agent / Sales representative for details",
            id : 'limit-check',
            buttons: [
            {
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    this.alertCtrl.dismiss(null,null,'limit-check');
                }
            },
            {
                text: 'Back Home',
                role: 'home',
                cssClass: 'danger',
                handler: () => {
                    this.alertCtrl.dismiss(null, null, 'limit-check');
                    this.modalCtrl.dismiss(null, null, 'success-book');
                    states.dispatch(new Navigate(['/','home','dashboard','home-tab']));
                    states.dispatch(new StateReset(SearchState,ResultState,BookState));
                }
            }
        ]
        })).pipe(flatMap((el) => from(el.present())));

        let agencyid = this.store.selectSnapshot(CompanyState.getCompany).agency_id;
        let fare = this.totalFare(mode,type);

        return states.dispatch([new SetAgency(agencyid),new SetVendor(agencyid.toString(),'vendor')])
            .pipe(
                flatMap(
                    () => {
                        let corpLimit = this.store.selectSnapshot(AgencyState.getCreditLimit);
                        if (mode == 'flight') {
                            let airlineLimit = this.store.selectSnapshot(VendorState.getAirlineVendor).cash_limits.amount;
                            console.log(fare,corpLimit, airlineLimit);
                            // (corpLimit > fare) && (airlineLimit > fare)
                            if (type == 'one-way') {
                                return states.dispatch(new BookOneWayTicket());
                            }
                            else if (type == 'round-trip') {
                              return states.dispatch(new InternationalTicket());
                            }
                            else if (type == 'animated-round-trip') {
                                return states.dispatch(new DomesticTicket());
                            }
                        }
                        else if(mode == 'hotel'){
                            let hotelLimit = this.store.selectSnapshot(VendorState.getHotelVendor).cash_limits.amount;
                            if((corpLimit > fare) && (hotelLimit > fare)) {
                                // states.dispatch(new HotelRequest(comment, mailCC, purpose))
                            }
                            else {
                                return failedAlert$;
                            }
                        }
                        return empty();
                    }
                )
            );
    }

    @Action(OfflineRequest)
    OfflineRequest(states: StateContext<book>) {

        this.modalCtrl.dismiss(null, null,'book-confirm');
        let mode = states.getState().mode;
        let type = states.getState().type;

        let comment = states.getState().comment;
        let mailCC = states.getState().mail;
        let purpose = states.getState().purpose;

        if (mode == 'flight') {
            if (type == 'one-way') {
                states.dispatch(new OneWayOfflineRequest(comment, mailCC, purpose));
            }
            else if (type == 'round-trip') {
                states.dispatch(new InternationalOfflineRequest(comment, mailCC, purpose));
            }
            else if (type == 'animated-round-trip') {
                states.dispatch(new DomesticOfflineRequest(comment, mailCC, purpose));
            }
            else if (type == 'multi-city') {
                states.dispatch(new MultiCityOfflineRequest(comment, mailCC, purpose));
            }
        }
        else if (mode == 'hotel') {
            states.dispatch(new HotelOfflineRequest(comment, mailCC, purpose));
        }
        else if (mode == 'bus') {
            // states.dispatch(new BusRequest(comment, mailCC, purpose));
        }
        else if (mode == 'train') {
            if (type == 'one-way') {
                // states.dispatch(new TrainOneWayRequest(comment,mailCC,purpose));
            }
            else if (type == 'round-trip') {
                // states.dispatch(new TrainRoundTripRequest(comment,mailCC,purpose));
            }
            else if (type == 'multi-city') {
            //    states.dispatch(new TrainMultiCityRequest(comment,mailCC,purpose));
            }
        }
        else if(mode == 'cab') {
          states.dispatch(new SendCabOfflineRequest(comment,mailCC,purpose));
        }
    }

    totalFare(mode : string,type : string) : number {
        if (mode == 'flight') {
            if (type == 'one-way') {
                return this.store.selectSnapshot(OneWayBookState.getTotalFare);
            }
            else if (type == 'round-trip') {
                return this.store.selectSnapshot(InternationalBookState.getTotalFare);
            }
            else if (type == 'animated-round-trip') {
                return this.store.selectSnapshot(DomesticBookState.getTotalFare);
            }
            else if (type == 'multi-city') {
                return this.store.selectSnapshot(MultiCityBookState.getTotalFare);
            }
        }
    }
}
