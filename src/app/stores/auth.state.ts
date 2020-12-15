import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, AlertController, MenuController } from '@ionic/angular';
import { GetUser, UserState } from './user.state';
import { CompanyState, GetCompany } from './company.state';
import { user } from '../models/user';
import { StateClear, StateReset, StateResetAll } from 'ngxs-reset-plugin';
import { DashboardState, UpcomingTrips } from './dashboard.state';
import { EligibilityState, GetEligibility } from './eligibility.state';
import { concat, forkJoin, from, of } from 'rxjs';
import { catchError, finalize, flatMap, map, first } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { ApprovalState } from './approval.state';
import { BookState } from './book.state';
import { BookingState } from './booking.state';
import { PassengerState } from './passenger.state';
import { ResultState } from './result.state';
import { FilterState } from './result/filter.state';
import { SortState } from './result/sort.state';
import { SearchState } from './search.state';
import { SharedState } from './shared.state';
import { ExpenseState } from './expense.state';
import { ThemeState } from './theme.stata';

export interface auth {
    forgotToken : string
    userLogin : boolean
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
        forgotToken : null,
        userLogin : false
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

    @Selector()
    static isLoggedIn(state : auth) : boolean {
        return state.userLogin;
    }

    @Action(Login)
    Login(states: StateContext<auth>, action: Login) {

        const loading$ = from(this.loadingCtrl.create({
            spinner: "crescent",
            message: "Login User...",
            id : 'login'
        })).pipe(flatMap(el => from(el.present())));

        const failedAlert$ = from(this.alertCtrl.create({
            header: 'Signup Failed',
            message: "UnAuthorized Users",
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    return true;
                }
            }]
        })).pipe(flatMap(el => from(el.present())));

        let login$ = from(this.authService.login(action.username, action.password));

        return forkJoin([loading$,login$])
            .pipe(
                flatMap(
                    (response) => {
                        let login = response[1];

                        let data: user = null;

                        const JSONdata = login.data;
                        console.log(JSON.parse(JSONdata));
                        sessionStorage.setItem('session', JSONdata);
                        const userResponse : user = JSON.parse(login.data);
                        data = userResponse;

                        return concat(
                            states.dispatch([
                                new GetUser(data),
                                new GetCompany(data.customer_id),
                                new GetEligibility(data.customer_id),
                                new UpcomingTrips()
                            ]),
                            from(this.loadingCtrl.dismiss(null,null,'login')),
                            states.dispatch(new Navigate(['/','home','dashboard','home-tab'])),
                            of(                       
                            states.patchState({
                                userLogin : true
                            }))
                        )
                    }
                ),
                catchError(
                    (error) => {
                        console.log(error);
                        if (error.error == "{message :'UnAuthorized User'}") 
                        {
                            return concat(
                                    from(this.loadingCtrl.dismiss(null,null,'login')),
                                    failedAlert$,
                                    states.dispatch(new Logout())
                                )
                        }
                    }
                ),
                first()
            );
    }

    @Action(Logout)
    Logout(states: StateContext<auth>) {

        return from(this.authService.logout())
            .pipe(
                flatMap(
                    (response : HTTPResponse) => {
                        if(response.status == 200) {
                            sessionStorage.clear();
                            return concat(
                                states.dispatch(new StateReset(
                                    AuthState,
                                    UserState,
                                    CompanyState,
                                    DashboardState,
                            
                                    SearchState,
                                    ResultState,
                                    BookState,
                            
                                    BookingState,
                                    ApprovalState,
                                    
                                    FilterState,
                                    SortState,
                                    SharedState,
                                    PassengerState,
                                    EligibilityState,
                                    ThemeState,

                                    ExpenseState
                                )),
                                from(this.menuCtrl.toggle('first')),
                                states.dispatch(new Navigate(['/', 'auth']))
                            );
                        }
                    }
                ),
                first()
            );
        
    }

    @Action(SendConfirmationEmail)
    async sendConfirmation(...el) {
        let action: SendConfirmationEmail = el[1];

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Email Sending Failed',
            subHeader: 'Problem sending mail',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    failedAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                }
            }]
        });
        const successAlert = await this.alertCtrl.create({
            header: 'Email Sending Success',
            subHeader:'Email Sent,Check for your mail',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    successAlert.dismiss({
                        data: true,
                        role: 'success'
                    });
                }
            }]
        });

        loading.message = "Sending Mail...";
        await loading.present();
        try {
            console.log(action.email);
            const sendmail = await this.authService.forgotPassword(action.email);
            loading.dismiss();
            successAlert.present(); 
            console.log(sendmail);
        }
        catch (error) {
            console.log(error);
            loading.dismiss();
            failedAlert.present(); 
        }
    }

    @Action(SetToken)
    setToken(states: StateContext<auth>, action: SetToken) {
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