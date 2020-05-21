import { State, Action, StateContext, Selector } from '@ngxs/store';
import { company } from '../models/company';

export class GetCompany {
    static readonly type = '[Company] GetCompany';
    constructor(public company: any) {

    }
}

export class UpdateCompany {
    static readonly type = '[Company] UpdateCompany';
    constructor(public company: any) {

    }
}

@State<company>({
    name: 'Company',
    defaults: null
})
export class CompanyState {

    constructor() {

    }

    @Selector()
    static getCompany(state: company) {
        return state;
    }

    @Action(GetCompany)
    async getCompany(states: StateContext<company>, action: GetCompany) {
        states.setState(action.company);
    }

    @Action(UpdateCompany)
    async updateCompany(states: StateContext<company>, action: GetCompany) {
        states.patchState(action.company);

    }

}