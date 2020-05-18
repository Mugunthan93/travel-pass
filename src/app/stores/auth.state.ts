import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { CompanyService } from '../services/company/company.service';
import { UserService } from '../services/user/user.service';

export interface Auth {
    user: any,
    company: any
}

export class Login {
    static readonly type = '[App] LoginUser';
    constructor(public username,public password) {
        
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

@State<Auth>({
    name : 'Auth',
    defaults:null
})
export class AuthState {

    constructor(
        private loadingCtrl: LoadingController,
        private toastrCtrl: ToastController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        private companyService: CompanyService,
        private userService: UserService,
        private store : Store
    ) {
    }

    @Selector()
    static getUser(state: Auth) {
        return state.user;
    }

    @Selector()
    static isUserAuthenticated(state: Auth): boolean {
        return !!state.user;
    }

    @Action(Login)
    async Login(states: StateContext<Auth>, action: Login) {
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

        let data = {
            user: null,
            company: null,
        }

        try {
            const userLoginResponse = await this.authService.login(action.username, action.password);
            const JSONdata = userLoginResponse.data;
            sessionStorage.setItem('session', JSONdata);
            const userResponse = JSON.parse(userLoginResponse.data);
            data.user = userResponse; 
        }
        catch (error) {
            console.log(error);
            failedAlert.message = error;
            loading.dismiss();
            failedAlert.present();
        }

        try {
            const getCompanyResponse = await this.companyService.getCompany(data.user.customer_id);
            console.log(getCompanyResponse);
            const comapanyResponse = JSON.parse(getCompanyResponse.data);
            data.company = comapanyResponse[0];

            states.patchState(data);
            loading.dismiss();
        }
        catch (error) {
            console.log(error);
            failedAlert.message = error;
            loading.dismiss();
            failedAlert.present();
        }

        if (data.user.role !== 'admin') {
            this.store.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
        }
        else if (data.user.role == 'admin') {
            if (data.company.status) {
                this.store.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
            }
            else if (!data.company.status){
                this.store.dispatch(new Navigate(['/', 'register']));
            }
        }
    }

    @Action(Logout)
    async Logout(states: StateContext<Auth>, action: Logout) {
        const logout = await this.authService.logout();
        sessionStorage.clear();
        states.patchState({
            user: null,
            company: null
        });
        this.store.dispatch(new Navigate(['/','auth','login']));
    }

    @Action(Signup)
    async Signup(states: StateContext<Auth>, action: Signup) {

        try {
            const sessionResponse = await this.authService.login("veera@tripmidas.com", "veera");
            const JSONdata = sessionResponse.data;
            sessionStorage.setItem('session', JSONdata);
        }
        catch (error) {
            console.log(error);
        }

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        const toastr = await this.toastrCtrl.create({
            duration: 2000
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Signup Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    console.log(res);
                    failedAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                }
            }]
        });
        const successAlert = await this.alertCtrl.create({
            header: 'Signup Success',
            message: 'Confirmation mail has been sent to your email ' + action.signupData.bussiness_email_id,
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'primary',
                handler: (res) => {
                    successAlert.dismiss();
                    sessionStorage.clear();
                    this.store.dispatch(new Navigate(['/','auth','login']));
                }
            }]
        });

        let data = {
            user: null,
            company: null,
        }
        
        loading.message = "Creating Company...";
        await loading.present();

        try {
            const createCompanyResponse = await this.companyService.createCompany(action.signupData);
            toastr.message = "company Created";
            const companyResponse = JSON.parse(createCompanyResponse.data);
            data.company = companyResponse.data;
            await toastr.present();
        }
        catch (error) {
            console.log(error);
            const err = JSON.parse(error.error);
            failedAlert.message = err.message;
            loading.dismiss();
            failedAlert.present();
        }

        try {
            loading.message = "Creating User..."
            const createUserResponse = await this.userService.createMainUser(action.signupData, data.company);
            toastr.message = "user Created";
            const userResponse = JSON.parse(createUserResponse.data);
            data.user = userResponse.data;
            await toastr.present();
        }
        catch (error) {
            console.log(error);
            const err = JSON.parse(error.error);
            loading.dismiss();
            failedAlert.message = err.message;
            loading.dismiss();
            failedAlert.present();
        }

        loading.dismiss();
        successAlert.present();

    }

}