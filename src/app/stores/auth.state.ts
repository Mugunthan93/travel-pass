import { State, Action, StateContext, Store } from '@ngxs/store';
import { AuthService } from '../services/auth/auth.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { CompanyService } from '../services/company/company.service';
import { UserService } from '../services/user/user.service';
import { GetUser } from './user.state';
import { GetCompany } from './company.state';
import { BranchService } from '../services/branch/branch.service';
import { GetBranches } from './branch.state';

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
        private toastrCtrl: ToastController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        private companyService: CompanyService,
        private branchService: BranchService,
        private userService: UserService,
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

        let data = {
            user: null,
            company: null,
            branch: null
        }

        // try {
        //     const sessionResponse = await this.authService.login("veera@tripmidas.com", "veera");
        //     const JSONdata = sessionResponse.data;
        //     console.log(JSON.parse(JSONdata));
        //     sessionStorage.setItem('session', JSONdata);
        // }
        // catch (error) {
        //     console.log(error);
        // }

        try {
            const userLoginResponse = await this.authService.login(action.username, action.password);
            const JSONdata = userLoginResponse.data;
            console.log(JSON.parse(JSONdata));
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

            loading.dismiss();
        }
        catch (error) {
            console.log(error);
            failedAlert.message = error;
            loading.dismiss();
            failedAlert.present();
        }

        try {
            const getBranchResponse = await this.branchService.getBranch(data.company.id);
            console.log(getBranchResponse);
            const branchResponse = JSON.parse(getBranchResponse.data);
            data.branch = branchResponse;
            console.log(data.branch);
        }
        catch (error) {
            console.log(error);
            failedAlert.message = error;
            loading.dismiss();
            failedAlert.present();
        }

        
        this.store.dispatch(new GetUser(data.user));
        this.store.dispatch(new GetCompany(data.company));
        this.store.dispatch(new GetBranches(data.branch));

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
    async Logout(states: StateContext<void>, action: Logout) {

        const logout = await this.authService.logout();
        sessionStorage.clear();
        this.store.dispatch(new Navigate(['/', 'auth', 'login']));
        
    }

    @Action(Signup)
    async Signup(states: StateContext<void>, action: Signup) {

        try {
            const sessionResponse = await this.authService.login("veera@tripmidas.com", "veera");
            // const JSONdata = sessionResponse.data;
            // console.log(JSON.parse(JSONdata));
            // sessionStorage.setItem('session', JSONdata);
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


// const veerObject = {
//     PAN_number: null,
//     address: null,
//     approver: null,
//     city: null,
//     country_name: null,
//     createdAt: "2018-11-09T08:03:23.357Z",
//     created_by: null,
//     credit_limit: 10000,
//     credit_req: null,
//     customer_id: 81,
//     designation: "developer",
//     dob: null,
//     email: "veera@tripmidas.com",
//     gender: null,
//     grade: null,
//     gst_details: null,
//     id: 224,
//     is_Password_Changed: true,
//     is_rightsto_book: null,
//     lastname: null,
//     manager_email: null,
//     manager_name: null,
//     markup_charge: null,
//     name: "Veera",
//     passport_expiry: null,
//     passport_no: null,
//     password: "$2a$10$RJa5sLQTNnWCJhAyo8L.6OyErvfRTd524K87Df.M8O45cS5rw2yWC",
//     phone_number: "9655261060",
//     resetPasswordExpires: "1576672044556",
//     resetPasswordToken: "6626f0bfd726076357f6efc8bd642d48ebc07f7b",
//     role: "management",
//     sales_id: null,
//     service_charge: null,
//     staff_code: null,
//     status: true,
//     updatedAt: "2019-12-18T12:25:56.214Z",
//     validity_period: null
// }
// sessionStorage.setItem('session', JSON.stringify(veerObject));