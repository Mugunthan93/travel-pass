import { State, Action, StateContext, Store } from '@ngxs/store';
import { UserState } from '../../user.state';
import { trainpassenger, AddTrainPassenger, TrainPassengerState } from '../../passenger/train.passenger.state';
import * as moment from 'moment';
import { Navigate } from '@ngxs/router-plugin';
import { BookMode, BookState, BookType } from '../../book.state';
import { TrainService } from 'src/app/services/train/train.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { catchError, flatMap, map } from 'rxjs/operators';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { StateReset } from 'ngxs-reset-plugin';
import { forkJoin, from, of } from 'rxjs';
import { ResultState } from '../../result.state';
import { SearchState } from '../../search.state';


export interface trainOnewayBook {
    Segments: segments,
    bookType: string
}

export interface segments {
    OriginName: string,//location
    OriginCountry: string, //""
    OriginCountryCode: string, //""
    OriginStation: string, //station_name(station_code)

    DestinationName: string,//location
    DestinationCountry: string,//""
    DestinationCountryCode: string,//""
    DestinationStation: string,//station_name(station_code)

    Class: string,//class

    PreferredArrivalTime: string,
    PreferredDepartureTime: string,//date

    trainName: string,//trainname
    trainNumber: string,//""

    Destination: string, //"staion code",
    Origin: string //"staion_code",
}

export interface train_oneway_request {
    passenger_details: {
        passenger: trainpassenger[],
        basiscInfo: {
            TotalBaseFare: number,
            book_type: string
        },
        country_flag: number
    },
    train_requests: {
        AdultCount: 0,
        ChildCount: 0,
        InfantCount: 0,
        JourneyType: 1,
        Segments: segments[]
    },
    transaction_id: any,
    user_id: number,
    customer_id: number,
    booking_mode: string,
    trip_type: string,
    comments: any,
    purpose: string,
    cancellation_charges: any,
    approval_mail_cc: string[],
    status: string,
    managers: {
        id: number,
        name: string,
        email: string
    }
}

export class BookTrainOneWay {
    static readonly type = "[trainOnewayBook] BookTrainOneWay";
    constructor(public segment : segments) {

    }
}

export class GetRequest {
    static readonly type = "[trainOnewayBook] GetRequest";
    constructor(public name: string,public type : string) {

    }
}

export class TrainOneWayRequest {
    static readonly type = "[trainOnewayBook] TrainOneWayRequest";
    constructor(public comment: string, public mailCC: string[],public purpose : string) {

    }
}



@State<trainOnewayBook>({
    name: 'trainOnewayBook',
    defaults: {
        Segments: null,
        bookType: null
    }
})

export class TrainOneWayBookState {

    constructor(
        private store: Store,
        private trainService : TrainService,
        public modalCtrl : ModalController,
        public alertCtrl : AlertController,
        public loadingCtrl : LoadingController
    ) {

    }

    @Action(BookTrainOneWay)
    bookTrain(states: StateContext<trainOnewayBook>, action: BookTrainOneWay) {

        states.patchState({
            Segments: action.segment
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
            new BookType('one-way'),
            new Navigate(['/', 'home','book', 'train', 'one-way'])
        ]);
    }

    @Action(GetRequest)
    getRequest(states: StateContext<trainOnewayBook>, action: GetRequest) {
        let currentsegment: segments = Object.assign({}, states.getState().Segments);
        currentsegment.trainName = Object.assign({},action.name);

        states.patchState({
            Segments: currentsegment,
            bookType: action.type
        });
    }

    @Action(TrainOneWayRequest)
    sendRequest(states: StateContext<trainOnewayBook>, action: TrainOneWayRequest) {

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
                AdultCount: 0,
                ChildCount: 0,
                InfantCount: 0,
                JourneyType: 1,
                Segments: [states.getState().Segments]
            },
            transaction_id: null,
            user_id: this.store.selectSnapshot(UserState.getUserId),
            customer_id: this.store.selectSnapshot(UserState.getcompanyId),
            booking_mode: 'offline',
            trip_type: 'business',
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