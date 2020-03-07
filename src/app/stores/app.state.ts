import { State, Action, StateContext, Selector } from '@ngxs/store';
import { user } from '../models/user';

export interface App {
    user : user | Object
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
    defaults:{
        user : null
    }
})
export class AppState {

    @Selector()
    static getUser(state: App) {
        return state.user;
    }

    @Action(AddUser)
    addUser(states : StateContext<App>,action : AddUser){
        const currentState = states.getState();
        console.log(currentState);
        states.patchState({
            user: action.payload
        });
        console.log(currentState);
    }

    @Action(RemoveUser)
    removeUser(states : StateContext<App>,action : AddUser){
        const currentState = states.getState();
        states.patchState({
            user : null
        });
    }

}