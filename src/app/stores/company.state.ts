import { company } from '../models/company';
import { StateContext, State, Action, Selector } from '@ngxs/store';
import { CompanyService } from '../services/company/company.service';

export class GetCompany {
    static readonly type = '[User] GetCompany';
    constructor(public companyId: number) {

    }
}

@State<company>({
    name: 'company',
    defaults: null
})

export class CompanyState {

    constructor(
        private companyService : CompanyService
    ) {

    }

    @Selector()
    static getDomesticCharge(states : company) {
        return states.service_charges.domesticCharge;
    }

    @Selector()
    static getInternationalCharge(states: company) {
        return states.service_charges.internationalCharge;
    }

    @Action(GetCompany)
    async getCompany(states: StateContext<company>, action: GetCompany) {
        try {
            const companyResponse = await this.companyService.getCompany(action.companyId);
            const company: company = JSON.parse(companyResponse.data);
            console.log(company);
            states.patchState(company[0]);
        }
        catch (error) {
            console.log(error);
        }

    }
    
}