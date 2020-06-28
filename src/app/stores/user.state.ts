import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { user } from '../models/user';
import { managers } from './book/flight.state';

export class GetUser {
    static readonly type = '[User] GetUser';
    constructor(public user : user) {

    }
}

export class UpdateUser {
    static readonly type = '[User] UpdateUser';
    constructor(public user : user) {

    }
}

@State<user>({
    name: 'user',
    defaults: null
})

export class UserState {

    constructor(
        private store:Store
    ) {

    }

    @Selector()
    static isUser(state: user) {
        return state.role == 'kiosk' ? true : false;
    }

    @Selector()
    static isManager(state: user): boolean {
        return state.role == 'manager' ? true : false;
    }

    @Selector()
    static user(state: user) {
        return state;
    }

    @Selector()
    static getUserId(state: user) : number {
        return state.id;
    }

    @Selector()
    static getApprover(state: user) : managers {
        return {
            id: state.approver.id,
            name: state.approver.name,
            mail: state.approver.approver.email
        }
    }

    @Selector()
    static getcompanyId(state: user) : number {
        return state.customer_id
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