import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { CompanyService } from '../services/company/company.service';
import { BranchService } from '../services/branch/branch.service';
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
    name : 'App',
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
                    console.log(res);
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
            console.log(userLoginResponse);
            const userResponse = JSON.parse(userLoginResponse.data);
            console.log(userResponse);
            data.user = userResponse; 
        }
        catch (error) {
            console.log(error);
            // const err = JSON.parse(error.error);
            // console.log(err.message);
            failedAlert.message = error;
            loading.dismiss();
            failedAlert.present();
        }

        try {
            const getCompanyResponse = await this.companyService.getCompany(data.user.customer_id);
            console.log(getCompanyResponse);
            const comapnyResponse = JSON.parse(getCompanyResponse.data);
            console.log(comapnyResponse);
            data.company = comapnyResponse.data;

            states.patchState(data);
            loading.dismiss();
            this.store.dispatch(new Navigate(['/','register']));
        }
        catch (error) {
            console.log(error); 
            // const err = JSON.parse(error.error);
            // console.log(err.message);
            failedAlert.message = error;
            loading.dismiss();
            failedAlert.present();
        }
    }

    @Action(Logout)
    async Logout(states: StateContext<Auth>, action: Logout) {
        const logout = await this.authService.logout();
        console.log(logout);
        states.patchState({
            user : null
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
            console.log(data);
            await toastr.present();
        }
        catch (error) {
            console.log(error);
            const err = JSON.parse(error.error);
            console.log(err.message);
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
            console.log(data);
            await toastr.present();
        }
        catch (error) {
            console.log(error);
            const err = JSON.parse(error.error);
            console.log(err.message);
            loading.dismiss();
            failedAlert.message = err.message;
            loading.dismiss();
            failedAlert.present();
        }

        states.setState(data); 
        loading.dismiss();
        successAlert.present();

    }

}