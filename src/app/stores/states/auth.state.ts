import { State, Selector, Action, StateContext } from '@ngxs/store';
import { user } from 'src/app/models/user';
import { AddUser, RemoveUser } from '../actions/auth.action';

export class UserModel {
    User: user
}

@State({
    name: 'user',
    defaults: {
        login: null
    }
})

export class UserState {

    @Selector()
    static(state: UserModel) {
        return state.User;
    }

    @Action(AddUser)
    add({ getState, patchState }: StateContext<UserModel>, { payload }: AddUser) {
        console.log(getState, patchState, payload);
    }

    @Action(RemoveUser)
    remove({ getState, patchState }: StateContext<UserModel>, { payload }: RemoveUser) {
        console.log(getState, patchState, payload);

    }

}