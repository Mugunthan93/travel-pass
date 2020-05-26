import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { user } from '../models/user';

export class GetUser {
    static readonly type = '[User] GetUser';
    constructor(public user : user) {

    }
}

export class GetUsers {
    static readonly type = '[User] GetUsers';
}

export class UpdateUser {
    static readonly type = '[User] UpdateUser';
    constructor(public user : user) {

    }
}

@State<user>({
    name: 'User',
    defaults: null
})
export class UserState {

    constructor(
        private store:Store
    ) {

    }

    @Selector()
    static user(state: user) {
        return state;
    }

    @Selector()
    static isUserAuthenticated(state: user): boolean {
        return !!state;
    }

    @Action(GetUsers)
    getUsers(states: StateContext<user>, action: GetUsers) {
        // this.store.dispatch()
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