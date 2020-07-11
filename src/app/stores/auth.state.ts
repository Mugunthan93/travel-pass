import { State, Action, StateContext, Store } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, AlertController, MenuController } from '@ionic/angular';
import { GetUser } from './user.state';
import { GetCompany } from './company.state';
import { user } from '../models/user';
import { StateResetAll } from 'ngxs-reset-plugin';
import { UpcomingTrips } from './dashboard.state';
import { SharedState } from './shared.state';

export interface auth {
    forgotToken : string
}

export class Login {
    static readonly type = '[Auth] LoginUser';
    constructor(public username: string,public password: string) {
    }
}

export class Logout {
    static readonly type = '[Auth] LogOutUser';
}

// export class Signup {
//     static readonly type = '[Auth] SignUpUser';
//     constructor(public signupData) {
        
//     }
// }

export class SendConfirmationEmail {
    static readonly type = '[Auth] ConirmationEmail';
    constructor(public email : string) {

    }
}

export class SetToken {
    static readonly type = '[Auth] SetToken';
    constructor(public token : string) {

    }
}

export class SetNewPassword {
    static readonly type = '[Auth] SetNewPassword';
    constructor(public password : string) {

    }
}

@State<auth>({
    name : 'Auth',
    defaults: {
        forgotToken : null
    }
})
export class AuthState {

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        public menuCtrl:MenuController,
        private store: Store
    ) {
    }

    @Action(Login)
    async Login(states: StateContext<auth>, action: Login) {

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Signup Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    failedAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                }
            }]
        });

        loading.message = "Login User...";
        await loading.present();

        let data : user = null;

        try {
            const userLoginResponse = await this.authService.login(action.username, action.password);
            console.log(userLoginResponse);
            const JSONdata = userLoginResponse.data;
            console.log(JSON.parse(JSONdata));
            sessionStorage.setItem('session', JSONdata);
            const userResponse : user = JSON.parse(userLoginResponse.data);
            data = userResponse;

            this.store.dispatch(new GetUser(data));
            this.store.dispatch(new GetCompany(data.customer_id));
            this.store.dispatch(new UpcomingTrips());
            loading.dismiss();
            this.store.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
        }
        catch (error) {
            console.log(error);
            if (error.error == "{message :'UnAuthorized User'}") {
                failedAlert.message = "UnAuthorized Users";
                this.store.dispatch(new Logout());
                loading.dismiss();
                failedAlert.present(); 
            }
        }
    }

    @Action(Logout)
    async Logout(states: StateContext<auth>, action: Logout) {

        const logout = await this.authService.logout();
        sessionStorage.clear();

        this.store.dispatch(new StateResetAll(SharedState));
        this.menuCtrl.toggle('first');
        this.store.dispatch(new Navigate(['/', 'auth']));
        
    }

    @Action(SendConfirmationEmail)
    async sendConfirmation(states: StateContext<auth>, action: SendConfirmationEmail) {
        try {
            console.log(action.email);
            const sendmail = await this.authService.forgotPassword(action.email);
            console.log(sendmail);
        }
        catch (error) {
            console.log(error);
        }
    }

    @Action(SetToken)
    async setToken(states: StateContext<auth>, action: SetToken) {
        states.patchState({
            forgotToken: action.token
        });
    }

    @Action(SetNewPassword)
    async setNewPassword(states: StateContext<auth>, action: SetNewPassword) {

        let token: string = states.getState().forgotToken;

        try {
            const setpassword = await this.authService.newPassword(token, action.password);
            console.log(setpassword);
        }
        catch (error) {
            console.log(error); 
        }
    }

}