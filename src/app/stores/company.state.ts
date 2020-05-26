import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { company } from '../models/company';
import { CompanyService } from '../services/company/company.service';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController, AlertController } from '@ionic/angular';

export class GetCompany {
    static readonly type = '[Company] GetCompany';
    constructor(public company: company) {

    }
}

export class UpdateCompany {
    static readonly type = '[Company] UpdateCompany';
    constructor(public company: company) {

    }
}

@State<company>({
    name: 'Company',
    defaults: null
})
export class CompanyState {

    constructor(
        private companyService: CompanyService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) {

    }

    @Selector()
    static company(state: company) {
        return state;
    }

    @Selector()
    static companyId(state: company) {
        return state.id;
    }

    @Action(GetCompany)
    async getCompany(states: StateContext<company>, action: GetCompany) {
        if (typeof action.company.gst_details == "string") {
            action.company.gst_details = JSON.parse(((action.company.gst_details) as unknown) as string);
        }
        states.setState(action.company);
    }

    @Action(UpdateCompany)
    async updateCompany(states: StateContext<company>, action: GetCompany) {

        const company: company = states.getState();
        const loading = await this.loadingCtrl.create({
            spinner: "crescent",
            message:"Updating Company..."
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Company Updation Failed',
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
        let success = false;
        loading.present();

        try {
            const updatedResponse = await this.companyService.updateCompany(company.id, action.company);
            console.log(updatedResponse);
            states.patchState(action.company);
            success = true;

            loading.dismiss();
        }
        catch (error) {
            console.log(error);
            failedAlert.message = error;
            loading.dismiss();
            failedAlert.present();
        }
        return success;
    }

}