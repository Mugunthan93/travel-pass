import { State, Action, StateContext } from '@ngxs/store';
import { user } from '../models/user';

export interface App {
    user : user
}

export class AddUser {
    static readonly type = '[App] AddUser';
    constructor(
        public payload : user
    ){

    }
}

export class RemoveUser {
    static readonly type = '[App] RemoveUser';
}

@State<App>({
    name : 'App',
    defaults : {
        user : null
    }
})
export class AppState {

    @Action(AddUser)
    addUser(state : StateContext<App>,action : AddUser){
        state.patchState({
            user : action.payload
        });
    }

    @Action(RemoveUser)
    removeUser(state : StateContext<App>,action : AddUser){
        state.patchState({
            user : null
        });
    }

}