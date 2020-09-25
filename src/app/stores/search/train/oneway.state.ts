import { State, Action, StateContext, Store } from '@ngxs/store';

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

export interface trainonewayPayload {

}

@State<trainOnewaySearch>({
    name: 'trainOnewaySearch',
    defaults: {
        formData: null
    }
})

export class TrainOneWaySearchState {

    constructor(
        private store : Store
    ) {

    }

    @Action(TrainOneWayForm)
    oneWayForm(states: StateContext<trainOnewaySearch>, action: TrainOneWayForm) {
        states.patchState({
            formData: action.form
        });
    }


    

    
    
}