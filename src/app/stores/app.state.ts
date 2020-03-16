import { State, Action, StateContext, Selector } from '@ngxs/store';
import { user } from '../models/user';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface App {
    user : user | Object
}

export class Login {
    static readonly type = '[App] LoginUser';
    constructor(public username,public password) {
        
    }
}

export class LogOut {
    static readonly type = '[App] LogOutUser';
}

@State<App>({
    name : 'App',
    defaults:{
        user : null
    }
})
export class AppState {

    constructor(
        public authService: AuthService,
        public router: Router
    ) {
        console.log(this.authService);
    }

    @Selector()
    static getUser(state: App) {
        return state.user;
    }

    @Selector()
    static isUserAuthenticated(state: App): boolean {
        return !!state.user;
    }

    @Action(Login)
    Login(states: StateContext<App>, action: Login) {
        return this.authService.login(action.username, action.password)
            .pipe(
                map(
                    (resData) => {    
                        const currentState = states.getState();
                        console.log(currentState);
                        states.patchState({
                            user: resData
                        });
                        console.log(currentState);
                        this.router.navigate(['/','home']);
                    }
                )
            );
    }

    @Action(LogOut)
    Logout(states : StateContext<App>,action : LogOut){
        const currentState = states.getState();
        states.patchState({
            user : null
        });
        console.log(currentState);
    }

}