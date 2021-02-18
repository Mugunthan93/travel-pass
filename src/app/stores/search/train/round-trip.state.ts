import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as moment from 'moment';
import { segments } from '../../book/train/one-way.state';
import { BookTrainRoundTrip } from '../../book/train/round-trip.state';

export interface trainRoundTripSearch {
    departure: trainroundtrip
    returns: trainroundtrip
}

export interface trainroundtrip{
    from_name: string
    from_code: string
    from_location: string
    to_name: string
    to_code: string
    to_location: string
    date: Date
    class: string
}

export interface trainroundtripform {
    from_name: string
    from_code: string
    from_location: string
    to_name: string
    to_code: string
    to_location: string
    departure_date: Date
    return_date: Date
    departure_class: string
    return_class: string
}

export class TrainRoundTripForm {
    static readonly type = "[trainRoundTripSearch] TrainRoundTripForm";
    constructor(public form: trainroundtripform) {

    }
}

@State<trainRoundTripSearch>({
    name: 'trainRoundTripSearch',
    defaults: {
        departure: null,
        returns: null
    }
})

@Injectable()
export class TrainRoundTripSearchState {

    constructor() {
    }

    @Selector()
    static getDeparture(state : trainRoundTripSearch) : trainroundtrip {
        return state.departure;
    }

    @Selector()
    static getReturn(state : trainRoundTripSearch) : trainroundtrip {
        return state.returns;
    }

    @Action(TrainRoundTripForm)
    roundTripForm(states: StateContext<trainRoundTripSearch>, action: TrainRoundTripForm) {

        let departure : trainroundtrip = {
            from_code : action.form.from_code,
            from_location: action.form.from_location,
            from_name: action.form.from_name,
            to_code : action.form.to_code,
            to_location: action.form.to_location,
            to_name: action.form.to_name,
            date: action.form.departure_date,
            class: action.form.departure_class
        };
        let returns: trainroundtrip = {
            from_code : action.form.to_code,
            from_location: action.form.to_location,
            from_name: action.form.to_name,
            to_code : action.form.from_code,
            to_location: action.form.from_location,
            to_name: action.form.from_name,
            date: action.form.return_date,
            class: action.form.return_class
        }

        states.patchState({
            departure : departure,
            returns: returns
        });

        let depSegment: segments = {
            OriginName: action.form.from_location,//location
            OriginCountry: "", //""
            OriginCountryCode: "", //""
            OriginStation: action.form.from_name+"("+action.form.from_code+")", //station_name(station_code)

            DestinationName: action.form.to_location,//location
            DestinationCountry: "",//""
            DestinationCountryCode: "",//""
            DestinationStation: action.form.to_name + "(" + action.form.to_code + ")",//station_name(station_code)

            Class: action.form.departure_class,//class

            PreferredArrivalTime: "",//""
            PreferredDepartureTime: moment(action.form.departure_date).format('YYYY-MM-DDTHH:mm:ss'),//date

            trainName: null,//trainname
            trainNumber: "",//""

            Origin: action.form.from_code, //"staion_code",
            Destination: action.form.to_code //"staion code",
        }

        let reSegment: segments = {
            OriginName: action.form.to_location,//location
            OriginCountry: "", //""
            OriginCountryCode: "", //""
            OriginStation: action.form.to_name+"("+action.form.to_code+")", //station_name(station_code)

            DestinationName: action.form.from_location,//location
            DestinationCountry: "",//""
            DestinationCountryCode: "",//""
            DestinationStation: action.form.from_name + "(" + action.form.from_code + ")",//station_name(station_code)

            Class: action.form.return_class,//class

            PreferredArrivalTime: "",//""
            PreferredDepartureTime: moment(action.form.return_date).format('YYYY-MM-DDTHH:mm:ss'),//date

            trainName: null,//trainname
            trainNumber: "",//""

            Destination: action.form.from_code, //"staion code",
            Origin: action.form.to_code //"staion_code",
        }

        states.dispatch(new BookTrainRoundTrip(depSegment,reSegment));
    }

}
