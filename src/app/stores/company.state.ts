import { company } from '../models/company';
import { StateContext, State, Action, Selector } from '@ngxs/store';
import { CompanyService } from '../services/company/company.service';
import { user } from '../models/user';
import { UserState } from './user.state';
import * as _ from 'lodash';
import { patch } from '@ngxs/store/operators';
import { empty, from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';

export interface companies {
    main : company
    current : company
    branches : company[]
}

export interface branchResponse {
    data: company[]
    message: string
    status: string
    status_code: number
}

export class GetCompany {
    static readonly type = '[User] GetCompany';
    constructor(public companyId: number) {

    }
}

@State<companies>({
    name: 'company',
    defaults: {
        main : null,
        current : null,
        branches : []
    }
})

export class CompanyState {

    constructor(
        private companyService : CompanyService
    ) {

    }

    @Selector()
    static getId(state: companies): number {
        return state.current.id;
    }

    @Selector()
    static getEmployees(state: companies): user[] {
        return state.current.Users;
    }

    @Selector()
    static getPCC(state: companies): number {
        return state.current.PCC;
    }

    @Selector()
    static gstNumber(states: companies): string {
        return states.current.gst_details.gstNo;
    }


    @Selector()
    static getCompanyName(state : companies) {
        return state.current.company_name;
    }

    @Selector([UserState])
    static getManagerList(state: companies,user : user) : user[] {
        return state.current.Users.filter((el: user) => !_.isEqual(el.id,user.id) && el.role == 'manager');
    }

    @Selector()
    static getContact(state: companies) {
        return state.current.phone_number
    }

    @Selector()
    static gstCompanyAddress(states: companies): string {
        return states.current.company_address_line1 +','+ states.current.company_address_line2;
    }

    @Selector()
    static gstCompanyEmail(states: companies): string {
        return states.current.gst_details.email;
    }

    @Selector()
    static getDomesticServiceCharge(states: companies): number {
        return _.isString(states.current.service_charges.domesticCharge) ? parseInt(states.current.service_charges.domesticCharge) : states.current.service_charges.domesticCharge;
    }

    @Selector()
    static getInternationalServiceCharge(states: companies) : number {
        return _.isString(states.current.service_charges.internationalCharge) ? parseInt(states.current.service_charges.internationalCharge) : states.current.service_charges.internationalCharge;
    }

    @Selector()
    static getHotelServiceCharge(states: companies): number{
        return states.current.service_charges.serviceHotelCharge;
    }

    @Selector()
    static getBusServiceCharge(states: companies): number {
        return parseInt(states.current.service_charges.serviceBusCharge);
    }

    @Selector()
    static getDomesticMarkupCharge(states: companies): number {
        return states.current.markup_charges.domesticCharge;
    }

    @Selector()
    static getInternationalMarkupCharge(states: companies): number {
        return states.current.markup_charges.internationalCharge;
    }

    @Selector()
    static getBusMarkupCharge(states: companies): number {
        return states.current.markup_charges.serviceBusCharge
    }

    @Selector()
    static getStateName(states: companies): string {
        return states.current.service_charges.state_name;
    }

    @Selector()
    static getCompany(states: companies): company {
        return states.current;
    }

    @Selector()
    static getApprovalStatus(states : companies) : boolean {
        return states.current.need_approval;
    }
j
    @Action(GetCompany)
    getCompany(states: StateContext<companies>, action: GetCompany) {

        let main$ = (id : number) => from(this.companyService.getCompany(id));
        let current$ = from(this.companyService.getCompany(action.companyId));
        let branches$ = (id : number) => from(this.companyService.getBranches(id));

        return current$
            .pipe(
                flatMap(
                    (current : HTTPResponse) => {
                        let company: company[] = JSON.parse(current.data);
                        
                        if(company[0].company_type == 'corporate') {
                            states.setState(patch({
                                current  : company[0],
                                main : company[0]
                            }));

                            return branches$(company[0].id)
                                .pipe(
                                    map(
                                        (branches) => {
                                            let br: branchResponse = JSON.parse(branches.data);
                                            states.setState(patch({
                                                branches : br.data
                                            }));
                                        }
                                    )
                                );
                        }
                        else if(company[0].company_type == 'corporate_branch'){
                            states.setState(patch({
                                current  : company[0]
                            }));

                            return main$(company[0].agency_id)
                                .pipe(
                                    flatMap(
                                        (main) => {
                                            let mainbr: company[] = JSON.parse(main.data);
                                            states.setState(patch({
                                                main : mainbr[0]
                                            }));
                                            return branches$(mainbr[0].id)
                                                .pipe(
                                                    map(
                                                        (branches) => {
                                                            let br: branchResponse = JSON.parse(branches.data);
                                                            states.setState(patch({
                                                                branches : br.data
                                                            }));
                                                        }
                                                    )
                                                );
                                        }
                                    )
                                );
                        }
                        else {
                            return empty();
                        }
                    }
                )
            );
    }
    
}