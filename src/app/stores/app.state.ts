import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { map, tap } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';
import { HTTPResponse } from '@ionic-native/http/ngx';

export interface App {
    user : any
}

export class Login {
    static readonly type = '[App] LoginUser';
    constructor(public username,public password) {
        
    }
}

export class Logout {
    static readonly type = '[App] LogOutUser';
}

@State<App>({
    name : 'App',
    defaults:null
})
export class AppState {

    constructor(
        public authService: AuthService,
        public store : Store
    ) {
    }

    @Selector()
    static getUser(state: App) {
        return state.user;
    }

    @Selector()
    static isUserAuthenticated(state: App): boolean {
        return !!state.user.id;
    }

    @Action(Login)
    async Login(states: StateContext<App>, action: Login) {
        const login = await this.authService.login(action.username, action.password);
        console.log(login);
        states.patchState({
            user : JSON.parse(login.data)
        });
        this.store.dispatch(new Navigate(['/','home']));
    }

    @Action(Logout)
    async Logout(states : StateContext<App>,action : Logout){
        const logout = await this.authService.logout();
        console.log(logout);
        states.patchState({
            user : null
        });
        this.store.dispatch(new Navigate(['/','auth','login']));
    }

}