import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { CompanyService } from '../services/company/company.service';
import { BranchService } from '../services/branch/branch.service';
import { UserService } from '../services/user/user.service';

export interface App {
    user: any,
    company: any,
    branch: any
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

@State<App>({
    name : 'App',
    defaults:null
})
export class AppState {

    constructor(
        private loadingCtrl: LoadingController,
        private toastrCtrl: ToastController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        private companyService: CompanyService,
        private branchService: BranchService,
        private userService: UserService,
        private store : Store
    ) {
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
    async Login(states: StateContext<App>, action: Login) {
        const loading = await this.loadingCtrl.create({
            message: "Login User...",
            spinner: "crescent"
        });

        const alert = await this.alertCtrl.create({
            header: 'Login Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    console.log(res);
                    alert.dismiss();
                }
            }]
        });


        const login = await this.authService.login(action.username, action.password);
        const user = JSON.parse(login.data);
        console.log(user);
        states.patchState({
            user : user
        });
        this.store.dispatch(new Navigate(['/','register']));
    }

    @Action(Logout)
    async Logout(states: StateContext<App>, action: Logout) {
        const logout = await this.authService.logout();
        console.log(logout);
        states.patchState({
            user : null
        });
        this.store.dispatch(new Navigate(['/','auth','login']));
    }

    @Action(Signup)
    async Signup(states: StateContext<App>, action: Signup) {

        const loading = await this.loadingCtrl.create({
            message: "Creating Company...",
            spinner: "crescent"
        });
        const toastr = await this.toastrCtrl.create({
            message: 'Company Created',
            duration: 2000
        });
        const alert = await this.alertCtrl.create({
            header: 'Signup Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    console.log(res);
                    alert.dismiss();
                }
            }]
        });

        let data = {
            user: null,
            company: null,
            branch: null
        }
        try {
            await loading.present();
            const companyResponse = await this.companyService.createCompany(action);

            await toastr.present();
            data.company = companyResponse.data;

            loading.message = "Creating Branch..."
            toastr.message = "Branch Created"
            const branchResponse = await this.branchService.createBranch(data.company.agency_id);
            data.branch = branchResponse.data;

            loading.message = "Creating User..."
            toastr.message = "User Created"
            const userResponse = await this.userService.createUser(action, data.branch.agency_id);
            data.user = userResponse.data;
        }
        catch (response) {
            const error = JSON.parse(response.error);
            console.log(error);
            if (error.status == "failure") {
                await loading.dismiss();
                alert.message = "Error while signup,Try again";
                await alert.present();
                return;
            }
        }
        finally {
            states.setState(data);
        }
    }

}