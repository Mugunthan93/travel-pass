import { State, Selector, Action, StateContext } from '@ngxs/store';
import { user, login } from '../models/user';

export class Login {
    static readonly type = '[User] Login';
    constructor(payload : login){

    }
}

export class UserModel {
    user : user;
}

@State<UserModel>({
    name : 'user',
    defaults : {
        user  : null
    }
})
export class UserState {

    @Selector()
    static getUsers(state: UserModel) {
        return state.user;
    }

    @Action(Login)
    add(currentUser: user) {
        
    }

}