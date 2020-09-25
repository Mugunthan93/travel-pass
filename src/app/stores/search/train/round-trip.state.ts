import { State, Action, StateContext } from '@ngxs/store';

export interface trainRoundTripSearch {
    formData: trainroundtripform
}

export interface trainroundtripform{
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
        formData: null
    }
})

export class TrainRoundTripSearchState {

    constructor() {

    }

    @Action(TrainRoundTripForm)
    roundTripForm(states: StateContext<trainRoundTripSearch>, action: TrainRoundTripForm) {
        states.patchState({
            formData: action.form
        });
    }




}