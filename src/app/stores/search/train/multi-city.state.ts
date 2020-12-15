
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { segments } from '../../book/train/one-way.state';
import * as moment from 'moment';
import { BookTrainMultiCityTrip } from '../../book/train/multi-city.state';

export interface trainMultiCitySearch {
    formData: trainmulticityform[]
}

export class trainmulticityform {
    from_name: string
    from_code: string
    from_location: string
    to_name: string
    to_code: string
    to_location: string
    date: Date
    class: string
}

export class TrainMultiCityForm {
    static readonly type = "[trainMultiCitySearch] TrainMultiCityForm";
    constructor(public form: trainmulticityform[]) {

    }
}

@State<trainMultiCitySearch>({
    name: 'trainMultiCitySearch',
    defaults: {
        formData: []
    }
})

export class TrainMultiCitySearchState {

    constructor() {

    }

    @Selector()
    static getMulticityForm(state : trainMultiCitySearch) : trainmulticityform[] {
        return state.formData;
    }

    @Action(TrainMultiCityForm)
    oneWayForm(states: StateContext<trainMultiCitySearch>, action: TrainMultiCityForm) {
        states.patchState({
            formData: action.form
        });

        let multcitySegment : segments[] = []
            .fill({})
            .map(
                (...el) => {
                    let ind = el[1];
                    return {
                        OriginName: action.form[ind].from_location,//location
                        OriginCountry: "", //""
                        OriginCountryCode: "", //""
                        OriginStation: action.form[ind].from_name+"("+action.form[ind].from_code+")", //station_name(station_code)
            
                        DestinationName: action.form[ind].to_location,//location
                        DestinationCountry: "",//""
                        DestinationCountryCode: "",//""
                        DestinationStation: action.form[ind].to_name + "(" + action.form[ind].to_code + ")",//station_name(station_code)
            
                        Class: action.form[ind].class,//class
            
                        PreferredArrivalTime: "",//""
                        PreferredDepartureTime: moment(action.form[ind].date).format('YYYY-MM-DDTHH:mm:ss'),//date
            
                        trainName: null,//trainname
                        trainNumber: "",//""
            
                        Origin: action.form[ind].from_code, //"staion_code",
                        Destination: action.form[ind].to_code //"staion code",
                    }
                }
            );

        states.dispatch(new BookTrainMultiCityTrip(multcitySegment));

    }



}