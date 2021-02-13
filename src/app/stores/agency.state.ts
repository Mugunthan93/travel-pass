import { state } from "@angular/animations";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map } from "rxjs/operators";
import { markupCharges, serviceCharges } from "../models/company";
import { user } from "../models/user";
import { AgencyService } from "../services/agency/agency.service";


export interface agency {
    id:number,
    company_name:string,
    company_address_line1:string,
    company_address_line2: string,
    phone_number:string,
    payment_method:string,
    cash_limits:{
        days:string,
        amount:number
    },
    gst_details:{
        email:string,
        gstNo:string,
        phoneNumber:string,
        TDS_Rate : {
            end_dt: string
            expired: boolean
            rate: number
            start_dt: string
        }[]
        gst_applied : {
            id: number
            lb: string
        }
    },
    service_charges:serviceCharges,
    markup_charges:markupCharges,
    city:string,
    country_name:string,
    country_code:string,
    status:boolean,
    company_email:string,
    company_type:string,
    agency_id:number,
    company_logo:string,
    permissions:any,
    consolidator:any[],
    credit_req:any,
    PCC:any,
    queue_number:any,
    target_branch:any,
    vendor_type:any,
    pincode: any,
    pan_number:string,
    invoice_prefix:any,
    expense:boolean,
    rights_to_book:boolean,
    travel_type:{
        isDomestic:boolean,
        isInternational:boolean
    },
    leg:{
        isMultileg:boolean,
        isSingleleg:boolean
    },
    need_approval:boolean,
    tm_credit_online:any,
    outsource_to_tripmidas:boolean,
    SCODE:any,
    CCODE:any,
    corp_code:{
        corpCode:string,
        airlineCode:string,
        airlineName:string
    }[],
    auth_sign_name:string,
    billing_account:string,
    purpose_type:{
        arr:string[],
        index:number
    },
    booking_amount:any,
    billing_sector:{
        bill_date:string,
        start_date:string,
        credit_limit:number,
        validity_days:number
    },
    createdAt:string,
    updatedAt:string,
    Users:user[]
}

export class SetAgency {
    static readonly type = "[AgencyState] SetAgency";
    constructor(public agencyId : number) {

    }
}


@State<agency>({
    name : 'agency',
    defaults : null
})

export class AgencyState {

    constructor(
        private agencyService : AgencyService
    ) {

    }

    @Selector()
    static getAgency(state : agency) : agency {
        return state;
    }

    @Selector()
    static getGstApplied(state : agency) : string {
        return state.gst_details.gst_applied.lb;
    }

    @Selector()
    static getCreditLimit(state : agency) : number {
        return state.cash_limits.amount;
    }


    @Action(SetAgency)
    setAgency(states : StateContext<agency>, action : SetAgency) {

        let agency$ = this.agencyService.getAgency(action.agencyId);
        return agency$.pipe(
            map(
                (response) => {
                    console.log(response); 
                    let agency: agency[] = JSON.parse(response.data);
                    states.patchState(agency[0]);
                }
            )
        );

    }



}