
import { State, Action, StateContext } from '@ngxs/store';

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

    @Action(TrainMultiCityForm)
    oneWayForm(states: StateContext<trainMultiCitySearch>, action: TrainMultiCityForm) {
        states.patchState({
            formData: action.form
        });
    }



}