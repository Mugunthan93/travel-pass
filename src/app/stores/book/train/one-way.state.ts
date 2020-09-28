import { State, Action, StateContext, Store } from '@ngxs/store';
import { UserState } from '../../user.state';
import { trainpassenger, AddTrainPassenger } from '../../passenger/train.passenger.state';
import * as moment from 'moment';
import { Navigate } from '@ngxs/router-plugin';
import { BookMode, BookType } from '../../book.state';


export interface trainOnewayBook {
    Segments: segments
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

export class BookTrainOneWay {
    static readonly type = "[trainOnewayBook] BookTrainOneWay";
    constructor(public segment : segments) {

    }
}

export class GetTrainName {
    static readonly type = "[trainOnewayBook] GetTrainName";
    constructor(public name : string,public index? : number) {

    }
}



@State<trainOnewayBook>({
    name: 'trainOnewayBook',
    defaults: {
        Segments: null
    }
})

export class TrainOneWayBookState {

    constructor(
        private store: Store
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

    @Action(GetTrainName)
    getTrainName(states: StateContext<trainOnewayBook>, action: GetTrainName) {
        let currentsegment = Object.assign({}, states.getState().Segments);
        currentsegment.trainName = action.name;

        states.patchState({
            Segments: currentsegment
        });

    }

}