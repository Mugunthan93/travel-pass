import { State, Selector, Action, Store, StateContext } from '@ngxs/store';
import { FLightBookState } from './book/flight.state';
import { HotelBookState } from './book/hotel.state';
import { BusBookState } from './book/bus.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { TrainBookState } from './book/train.state';
import { TrainOneWayRequest } from './book/train/one-way.state';
import { from, Observable } from 'rxjs';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { SearchState } from './search.state';
import { ResultState } from './result.state';
import { map } from 'rxjs/operators';
import { FlightOneWaySendRequest } from './book/flight/oneway.state';
import { InternationalSendRequest } from './book/flight/international.state';
import { DomesticSendRequest } from './book/flight/domestic.state';
import { MultiCitySendRequest } from './book/flight/multi-city.state';

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
        FLightBookState,
        HotelBookState,
        BusBookState,
        TrainBookState
    ]
})

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
    sendRequest(states: StateContext<book>, action: SendRequest) {
        let mode = states.getState().mode;
        let type = states.getState().type;

        let comment = states.getState().comment;
        let mailCC = states.getState().mail;
        let purpose = states.getState().purpose;

        const loading$: Observable<HTMLIonLoadingElement>= from(this.loadingCtrl.create({
            spinner: "crescent",
            message: "Request Sending"
        }));

        const failedAlert$: Observable<HTMLIonAlertElement> = from(this.alertCtrl.create({
            header: 'Send Request Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    return true;
                }
            }]
        }));

        const successAlert$: Observable<HTMLIonAlertElement> = from(this.alertCtrl.create({
            header: 'Send Request Success',
            subHeader: 'Request status will be updated in My Bookings',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    states.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
                    states.dispatch(new StateReset(SearchState, ResultState, BookState));
                    this.modalCtrl.dismiss(null, null, 'send-request');
                    return true;
                }
            }]
        }));

        return loading$
            .pipe(
                map(
                    (loadingEl) => {
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
                            
                        }
                        else if (mode == 'bus') {
                            
                        }
                        else if (mode == 'train') {
                            if (type == 'one-way') {
                                states.dispatch(new TrainOneWayRequest(comment,mailCC,purpose));
                            }
                            else if (type == 'round-trip') {
                
                            }
                            else if (type == 'multi-city') {
                
                            }
                        }
                        loadingEl.dismiss();
                        return successAlert$;
                    }
                )
            )



    }

    @Action(BookBack)
    bookback(states: StateContext<book>) {
        let bookMode: string = states.getState().mode;
        let bookType: string = states.getState().type;

        if (bookType == 'animated-round-trip') {
            bookType = 'round-trip';
        }
        if (bookMode == 'flight') {
            states.dispatch(new Navigate(['/', 'home', 'result', bookMode, bookType]));
        }
        if (bookMode == 'train') {
            states.dispatch(new Navigate(['/', 'home', 'search', bookMode, bookType]));
        }
        else {
            states.dispatch(new Navigate(['/', 'home', 'result', bookMode]));
        }
        states.dispatch(new StateReset(BookState));
    }
}