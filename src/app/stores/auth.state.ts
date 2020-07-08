import { State, Action, StateContext, Store } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, AlertController, MenuController } from '@ionic/angular';
import { GetUser, UserState } from './user.state';
import { GetCompany, CompanyState } from './company.state';
import { user } from '../models/user';
import { StateReset, StateResetAll } from 'ngxs-reset-plugin';
import { DashboardState, UpcomingTrips } from './dashboard.state';
import { SearchState } from './search.state';
import { ResultState } from './result.state';
import { BookState } from './book.state';
import { FlightSearchState } from './search/flight.state';
import { FlightResultState } from './result/flight.state';
import { FLightBookState } from './book/flight.state';
import { OneWaySearchState } from './search/flight/oneway.state';
import { RoundTripSearchState } from './search/flight/round-trip.state';
import { MultiCitySearchState } from './search/flight/multi-city.state';
import { OneWayResultState } from './result/flight/oneway.state';
import { DomesticResultState } from './result/flight/domestic.state';
import { InternationalResultState } from './result/flight/international.state';
import { MultiCityResultState } from './result/flight/multi-city.state';
import { OneWayBookState } from './book/flight/oneway.state';
import { DomesticBookState } from './book/flight/domestic.state';
import { InternationalBookState } from './book/flight/international.state';
import { MultiCityBookState } from './book/flight/multi-city.state';
import { BookingState } from './booking.state';
import { ApprovalState } from './approval.state';
import { FilterState } from './result/filter.state';
import { SharedState } from './shared.state';

export class Login {
    static readonly type = '[App] LoginUser';
    constructor(public username: string,public password: string) {
    }
}

export class Logout {
    static readonly type = '[App] LogOutUser';
}

export class Signup{
    static readonly type = '[App] SignUpUser';
    constructor(public signupData) {
        
    }
}

@State<void>({
    name : 'Auth',
    defaults:null
})
export class AuthState {

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        public menuCtrl:MenuController,
        private store : Store
    ) {
    }

    @Action(Login)
    async Login(states: StateContext<void>, action: Login) {

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
    async Logout(states: StateContext<void>, action: Logout) {

        const logout = await this.authService.logout();
        sessionStorage.clear();

        this.store.dispatch(new StateResetAll(SharedState));
        this.menuCtrl.toggle('first');
        this.store.dispatch(new Navigate(['/', 'auth']));
        
    }

}