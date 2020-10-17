import { State, Selector, Action, Store, StateContext } from '@ngxs/store';
import { FLightBookState } from './book/flight.state';
import { HotelBookState, HotelRequest } from './book/hotel.state';
import { BusBookState, BusRequest } from './book/bus.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { TrainBookState } from './book/train.state';
import { TrainOneWayRequest } from './book/train/one-way.state';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FlightOneWaySendRequest } from './book/flight/oneway.state';
import { InternationalSendRequest } from './book/flight/international.state';
import { DomesticSendRequest } from './book/flight/domestic.state';
import { MultiCitySendRequest } from './book/flight/multi-city.state';
import { TrainRoundTripRequest } from './book/train/round-trip.state';
import { TrainMultiCityRequest } from './book/train/multi-city.state';
import { from } from 'rxjs/internal/observable/from';
import { flatMap } from 'rxjs/operators';
import { PassengerState } from './passenger.state';
import { BookConfirmationComponent } from '../components/shared/book-confirmation/book-confirmation.component';

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

export class GetSendRequest {
    static readonly type = "[book] GetSendRequest";
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

    @Action(GetSendRequest)
    getSendRequest(states: StateContext<book>) {
        let passegerSelect$ = from(this.alertCtrl.create({
            header : 'Select Passenger',
            message : 'Select Your passenger to send request',
            buttons : [{
                text : 'OK',
                handler : () => {
                    return true;
                }
            }]
         })).pipe(flatMap(el => from(el.present())));
 
         const modal$ = from(this.modalCtrl.create({
             component: BookConfirmationComponent,
             id: "book-confirm",
           })).pipe(flatMap(el => from(el.present())));
 
         let check_passenger$ =  this.store.select(PassengerState.getCheckPassenger);
 
         return check_passenger$
             .pipe(
                 flatMap(
                     (check) => {
                         if(check == false) {
                             console.log(check + ' passenger is not selected');
                             return passegerSelect$;
                         }
                         else if(check == true) {
                             console.log(check + ' passenger is selected');
                             return modal$
                         }
                     }
                 )
             );
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