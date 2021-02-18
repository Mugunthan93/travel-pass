import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { BookTrainOneWay, segments } from '../../book/train/one-way.state';
import * as moment from 'moment';
import { Injectable } from '@angular/core';

export interface trainOnewaySearch {
    formData: trainonewayform
}

export class TrainOneWayForm {
    static readonly type = "[trainOnewaySearch] trainOneWayForm";
    constructor(public form: trainonewayform) {

    }
}

export class trainonewayform {
    from_name: string
    from_code: string
    from_location: string
    to_name: string
    to_code: string
    to_location: string
    date: Date
    class: string
}

@State<trainOnewaySearch>({
    name: 'trainOnewaySearch',
    defaults: {
        formData: null
    }
})

@Injectable()
export class TrainOneWaySearchState {

    constructor(
    ) {

    }

    @Selector()
    static getOnewaySearch(state: trainOnewaySearch): trainonewayform {
        return state.formData;
    }

    @Action(TrainOneWayForm)
    oneWayForm(states: StateContext<trainOnewaySearch>, action: TrainOneWayForm) {
        states.patchState({
            formData: action.form
        });

        let currentSegment: segments = {
            OriginName: action.form.from_location,//location
            OriginCountry: "", //""
            OriginCountryCode: "", //""
            OriginStation: action.form.from_name+"("+action.form.from_code+")", //station_name(station_code)

            DestinationName: action.form.to_location,//location
            DestinationCountry: "",//""
            DestinationCountryCode: "",//""
            DestinationStation: action.form.to_name + "(" + action.form.to_code + ")",//station_name(station_code)

            Class: action.form.class,//class

            PreferredArrivalTime: "",//""
            PreferredDepartureTime: moment(action.form.date).format('YYYY-MM-DDTHH:mm:ss'),//date

            trainName: null,//trainname
            trainNumber: "",//""

            Destination: action.form.to_code, //"staion code",
            Origin: action.form.from_code //"staion_code",
        }

        states.dispatch(new BookTrainOneWay(currentSegment));
    }






}
