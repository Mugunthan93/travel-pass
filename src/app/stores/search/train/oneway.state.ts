import { State, Action, StateContext, Store } from '@ngxs/store';
import { trainstation } from '../../shared.state';
import { TrainSearchState } from '../train.state';

export interface trainOnewaySearch {
    formData: any,
    payload: any
}

export class TrainOneWayForm {
    static readonly type = "[trainOnewaySearch] trainOneWayForm";
    constructor(public form: trainonewayform) {

    }
}

export class trainonewayform {
    class: string
    date: Date
    from: trainstation & string
    to: trainstation & string
}

export interface trainonewayPayload {

}

@State<trainOnewaySearch>({
    name: 'trainOnewaySearch',
    defaults: {
        formData: null,
        payload: null
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