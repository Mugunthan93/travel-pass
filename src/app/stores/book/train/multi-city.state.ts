import { Action, State, StateContext, Store } from '@ngxs/store';
import { AddTrainPassenger, trainpassenger, TrainPassengerState } from '../../passenger/train.passenger.state';
import { UserState } from '../../user.state';
import { segments, train_oneway_request } from './one-way.state';
import * as moment from 'moment';
import { BookMode, BookType } from '../../book.state';
import { Navigate } from '@ngxs/router-plugin';
import { forkJoin, from, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { TrainService } from 'src/app/services/train/train.service';
import { TrainSearchState } from '../../search/train.state';

export interface trainMultiCityBook {
    segmentArray : segments[],
    bookType: string
}

export class BookTrainMultiCityTrip {
    static readonly type = "[trainMultiCityBook] BookTrainMultiCityTrip";
    constructor(public segments : segments[]) {

    }
}

export class GetRequest {
    static readonly type = "[trainMultiCityBook] GetRequest";
    constructor(public names: string[],public type : string) {

    }
}


export class TrainMultiCityRequest {
    static readonly type = "[trainMultiCityBook] TrainMultiCityRequest";
    constructor(public comment: string, public mailCC: string[],public purpose : string) {

    }
}

@State<trainMultiCityBook>({
    name: 'trainMultiCityBook',
    defaults: {
        segmentArray: [],
        bookType : null
    }
})

export class TrainMultiCityBookState {
    

    constructor(
        private store : Store,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        private trainService: TrainService
    ) {

    }

    @Action(BookTrainMultiCityTrip)
    bookTrain(states: StateContext<trainMultiCityBook>, action: BookTrainMultiCityTrip) {

        states.patchState({
            segmentArray : action.segments
        });

        let user = this.store.selectSnapshot(UserState.getUser);
        let pass: trainpassenger = {
            primary: true,
            email: user.email,
            name: user.name,
            lastName: user.lastname,
            Address: user.address,
            mobile: user.phone_number,
            idType: "PAN Card",
            idNumber: user.PAN_number,
            title: user.gender == 'Female' ? 'Ms' : 'Mr',
            sex: user.gender == 'Male' ? 'M' : 'F',
            age: moment().diff(this.store.selectSnapshot(UserState.getDOB), 'years', false).toString(),
            pax_type: 'Adult',
            prefSeat: 'Seat'
        }

        states.dispatch([
            new AddTrainPassenger(pass),
            new BookMode('train'),
            new BookType('multi-city'),
            new Navigate(['/', 'home','book', 'train', 'multi-city'])
        ]);
    }

    @Action(GetRequest)
    getRequest(states: StateContext<trainMultiCityBook>, action: GetRequest) {
        
        let segments: segments[] = Object.assign([], states.getState().segmentArray);

        segments.forEach(
            (el,ind,arr) => {
                el.trainName = Object.assign({},action.names[ind]);
            }
        );

        states.patchState({
            segmentArray: segments,
            bookType: action.type
        });
    }

    @Action(TrainMultiCityRequest)
    sendRequest(states: StateContext<trainMultiCityBook>, action: TrainMultiCityRequest) {

        let loading$ = from(this.loadingCtrl.create({
            spinner: 'crescent',
            message: 'Sending Request...',
            id: 'send-req-loading'
        })).pipe(
            flatMap(
                (loadingEl) => {
                    return from(loadingEl.present());
                }
            )
        );

        let failedAlert$ = from(this.alertCtrl.create({
            header: 'Send Request Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                handler: () => {
                    return false;
                }
            }]
        })).pipe(
            flatMap(
                (alertEl) => {
                    return from(alertEl.present());
                }
            )
        );

        let successAlert$ = from(this.alertCtrl.create({
            header: 'Request Success',
            subHeader: 'Send Request Success',
            message: 'Request Sent Successfully..',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        states.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']))
                        .subscribe({
                            complete: () => {
                                this.modalCtrl.dismiss(null, null,'book-confirm');
                                }
                            });
                    }
                }
            ]
        })).pipe(
            flatMap(
                (alertEl) => {
                    return from(alertEl.present());
                }
            )
        );

        let passenger = this.store.selectSnapshot(TrainPassengerState.getPassenger);
        let req: train_oneway_request = {
            passenger_details: {
                passenger: passenger,
                basiscInfo: {
                    TotalBaseFare: 0,
                    book_type: states.getState().bookType
                },
                country_flag: 0
            },
            train_requests: {
                AdultCount: '0',
                ChildCount: '0',
                InfantCount: '0',
                JourneyType: this.store.selectSnapshot(TrainSearchState.getJourneyType),
                Segments: states.getState().segmentArray
            },
            transaction_id: null,
            user_id: this.store.selectSnapshot(UserState.getUserId),
            customer_id: this.store.selectSnapshot(UserState.getcompanyId),
            booking_mode: 'offline',
            trip_type: this.store.selectSnapshot(TrainSearchState.getTravelType),
            comments: action.comment,
            approval_mail_cc: action.mailCC,
            purpose: action.purpose,
            cancellation_charges: null,
            status: 'new',
            managers: this.store.selectSnapshot(UserState.getApprover)
        }

        let sendRequest$ = this.trainService.sendRequest(req)

        return forkJoin(loading$, sendRequest$)
            .pipe(
                flatMap(
                    (el) => {
                        console.log(el);
                        if (el[1].status == 200) {  
                            console.log(JSON.parse(el[1].data));
                            return forkJoin(from(this.loadingCtrl.dismiss(null, null, 'send-req-loading')),successAlert$);
                        }
                        else {
                            return forkJoin(from(this.loadingCtrl.dismiss(null, null, 'send-req-loading')), failedAlert$);
                        }
                    }
                ),
                catchError(
                    (error) => {
                        console.log(error);
                        return of(error);
                    }
                )
            );

    }

}