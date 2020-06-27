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
    static getDomesticServiceCharge(states: company): number {
        return parseInt(states.service_charges.domesticCharge);
    }

    @Selector()
    static getInternationalServiceCharge(states: company) : number {
        return states.service_charges.internationalCharge;
    }

    @Selector()
    static getDomesticMarkupCharge(states: company): number {
        return states.markup_charges.domesticCharge;
    }

    @Selector()
    static getInternationalMarkupCharge(states: company): number {
        return states.markup_charges.internationalCharge;
    }

    @Selector()
    static getStateName(states: company): string {
        return states.service_charges.state_name;
    }
    @Action(GetCompany)
    async getCompany(states: StateContext<company>, action: GetCompany) {
        try {
            const companyResponse = await this.companyService.getCompany(action.companyId);
            let company: company = JSON.parse(companyResponse.data);
            states.patchState(company[0]);
        }
        catch (error) {
            console.log(error);
        }

    }
    
}