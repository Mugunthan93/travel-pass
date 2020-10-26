import { Action, Selector, State, StateContext } from '@ngxs/store';


export interface theme {
    name : string
}

export class SetTheme {
    static readonly type = '[theme] SetTheme';
    constructor(public name : string) {

    }
}

@State<theme>({
    name: 'theme',
    defaults: {
        name : "home-tab"
    }
})

export class ThemeState {

    constructor() {

    }

    @Selector()
    static getTheme(state : theme) : string {
        return state.name;
    }

    @Action(SetTheme)
    setTheme(states : StateContext<theme>, action : SetTheme) {
        states.patchState({
            name : action.name
        });
    }

}