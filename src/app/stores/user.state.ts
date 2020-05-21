import { State, Action, StateContext, Selector } from '@ngxs/store';
import { user } from '../models/user';

export class GetUser {
    static readonly type = '[User] GetUser';
    constructor(public user : any) {

    }
}

export class UpdateUser {
    static readonly type = '[User] UpdateUser';
    constructor(public user : any) {

    }
}

@State<user>({
    name: 'User',
    defaults: null
})
export class UserState {

    constructor() {

    }

    @Selector()
    static getUser(state: user) {
        return state;
    }

    @Selector()
    static isUserAuthenticated(state: user): boolean {
        return !!state;
    }

    @Action(GetUser)
    getUser(states: StateContext<user>, action: GetUser) {
        states.setState(action.user);
    }

    @Action(UpdateUser)
    updateUser(states: StateContext<user>, action: UpdateUser) {
        states.patchState(action.user);
    }
}