import { State, Selector, Action, StateContext, Store } from "@ngxs/store";
import { company } from '../models/company';
import { LoadingController, AlertController } from '@ionic/angular';
import { BranchService } from '../services/branch/branch.service';
import { CompanyState } from './company.state';

export class CreateBranch{
    static readonly type = '[Branch] CreateBranch';
    constructor(public branch: any) {

    }
}

export class GetBranches {
    static readonly type = '[Branch] GetBranches';
    constructor(public branch: company[]) {

    }
}

export class GetBranch {
    static readonly type = '[Branch] GetBranch';
    constructor(public branchId: number) {

    }
}

export class UpdateBranch {
    static readonly type = '[Branch] UpdateBranch';
    constructor(public branch: company) {

    }
}

export class Removebranch{
    static readonly type = '[Branch] RemoveBranch';
    constructor(public branchId: number) {

    }
}

@State({
    name: 'Branch',
    defaults:[]
})
export class BranchState{

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl:AlertController,
        private branchService: BranchService,
        private store: Store
    ) {

    }

    @Selector()
    static branches(state: company[]) {
        return state;
    }

    @Action(CreateBranch)
    async createBranch(states: StateContext<company[]>, action: CreateBranch) {
        const loading = await this.loadingCtrl.create({
            spinner: "crescent",
            message: "Creating Branch..."
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Creating Branch Failed',
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
            const createBranchReponse = await this.branchService.createBranch(action.branch, this.store.selectSnapshot(CompanyState.companyId));
            console.log(createBranchReponse);
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
        
    @Action(GetBranches)
    async getBranches(states: StateContext<company[]>, action: GetBranches) {
        console.log(action);
        action.branch.forEach(
            (br) => {
                if (typeof br.gst_details == "string") {
                    br.gst_details = JSON.parse(((br.gst_details) as unknown) as string);
                }
            }
        );
        states.setState(action.branch);
        return true;
    }

    @Action(UpdateBranch)
    async updateBranch(states: StateContext<company[]>, action: UpdateBranch) {
        // states.patchState(action.branch);
    }
}