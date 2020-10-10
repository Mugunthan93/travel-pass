import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { TrainService } from 'src/app/services/train/train.service';
import { AddTrainPassenger, trainpassenger, TrainPassengerState } from '../../passenger/train.passenger.state';
import { UserState } from '../../user.state';
import { segments, train_oneway_request } from './one-way.state';
import * as moment from 'moment';
import { BookMode, BookType } from '../../book.state';
import { Navigate } from '@ngxs/router-plugin';
import { from, forkJoin, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { TrainSearchState } from '../../search/train.state';

export interface trainRoundTripBook {
    departure: segments
    return: segments
    bookType: string
}

export class BookTrainRoundTrip {
    static readonly type = "[trainRoundTripBook] BookTrainRoundTrip";
    constructor(public departureSeg : segments, public returnSeg : segments) {

    }
}

export class GetRequest {
    static readonly type = "[trainRoundTripBook] GetRequest";
    constructor(public depname: string, public rename: string,public type : string) {

    }
}


export class TrainRoundTripRequest {
    static readonly type = "[trainRoundTripBook] TrainRoundTripRequest";
    constructor(public comment: string, public mailCC: string[],public purpose : string) {

    }
}

@State<trainRoundTripBook>({
    name: 'trainRoundTripBook',
    defaults: {
        departure: null,
        return: null,
        bookType: null
    }
})

export class TrainRoundTripBookState {
    
    constructor(
        private store: Store,
        private trainService : TrainService,
        public modalCtrl : ModalController,
        public alertCtrl : AlertController,
        public loadingCtrl : LoadingController
    ) {

    }

    @Action(BookTrainRoundTrip)
    bookTrain(states: StateContext<trainRoundTripBook>, action: BookTrainRoundTrip) {

        states.patchState({
            departure: action.departureSeg,
            return: action.returnSeg
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
            new BookType('round-trip'),
            new Navigate(['/', 'home','book', 'train', 'round-trip'])
        ]);
    }

    @Action(GetRequest)
    getRequest(states: StateContext<trainRoundTripBook>, action: GetRequest) {
        let departuresegment: segments = Object.assign({}, states.getState().departure);
        departuresegment.trainName = Object.assign({},action.depname);

        let returnsegment: segments = Object.assign({}, states.getState().return);
        returnsegment.trainName = Object.assign({},action.rename);

        states.patchState({
            departure: departuresegment,
            return: returnsegment,
            bookType: action.type
        });
    }

    @Action(TrainRoundTripRequest)
    sendRequest(states: StateContext<trainRoundTripBook>, action: TrainRoundTripRequest) {

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

        let userMail : string = this.store.selectSnapshot(UserState.getEmail);
        let allCC : string[] = Object.assign([],action.mailCC);
        allCC.push(userMail);

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
                AdultCount: 0,
                ChildCount: 0,
                InfantCount: 0,
                JourneyType: this.store.selectSnapshot(TrainSearchState.getJourneyType),
                Segments: [states.getState().departure,states.getState().return]
            },
            transaction_id: null,
            user_id: this.store.selectSnapshot(UserState.getUserId),
            customer_id: this.store.selectSnapshot(UserState.getcompanyId),
            booking_mode: 'offline',
            trip_type: this.store.selectSnapshot(TrainSearchState.getTravelType),
            comments: action.comment,
            approval_mail_cc: allCC,
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