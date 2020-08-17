import { company } from '../models/company';
import { StateContext, State, Action, Selector } from '@ngxs/store';
import { CompanyService } from '../services/company/company.service';
import { user } from '../models/user';
import { UserState } from './user.state';
import * as _ from 'lodash';

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
    static getPCC(state: company): number {
        return state.PCC;
    }

    @Selector()
    static gstNumber(states: company): string {
        return states.gst_details.gstNo;
    }


    @Selector()
    static getCompanyName(state : company) {
        return state.company_name;
    }

    @Selector([UserState])
    static getManagerList(state: company,user : user) : user[] {
        return state.Users.filter((el: user) => el.role == 'manager' && !_.isEqual(el,user));
    }

    @Selector()
    static getContact(state: company) {
        return state.phone_number
    }

    @Selector()
    static gstCompanyAddress(states: company): string {
        return states.company_address_line1 +','+ states.company_address_line2;
    }

    @Selector()
    static gstCompanyEmail(states: company): string {
        return states.gst_details.email;
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

    @Selector()
    static getCompany(states: company): company {
        return states;
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