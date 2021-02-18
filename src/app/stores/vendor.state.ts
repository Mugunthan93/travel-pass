import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { patch } from "@ngxs/store/operators";
import { map } from "rxjs/operators";
import { user } from "../models/user";
import { AuthService } from "../services/auth/auth.service";

export interface vendors {
    vendors : vendor[]
}

export interface vendor {
    CCODE: any
    PCC: string
    SCODE: string
    Users: user[]
    agency_id: number
    auth_sign_name: any
    billing_account: any
    billing_sector: any
    booking_amount: number
    cash_limits: {
        days: number,
        amount: number
    }
    city: any
    company_address_line1: any
    company_address_line2: any
    company_email: string
    company_logo: any
    company_name: string
    company_type: string
    consolidator: any
    corp_code: any
    country_code: any
    country_name: any
    createdAt: string
    credit_req: any
    email_setup: any
    expense: any
    gst_details: {
        email: string,
        gstNo: string,
        TDS_Rate: any[],
        gst_applied: any,
        phoneNumber: string
    }
    id: number
    invoice_prefix: any
    leg: any
    markup_charges: any
    need_approval: any
    outsource_to_tripmidas: any
    pan_number: any
    payment_method: any
    permissions: any
    phone_number: string
    pincode: any
    purpose_type: any
    queue_number: number
    rights_to_book: any
    service_charges: any
    status: boolean
    target_branch: string
    tm_credit_online: any
    travel_type: any
    updatedAt: string
    vendor_type: string
}



export class SetVendor {
    static readonly type = "[vendor] SetVendor";
    constructor(public agencyId : string, public type : string) {

    }
}

@State<vendors>({
     name : 'vendor',
     defaults : {
         vendors : []
     }
})

@Injectable()
export class VendorState {

    constructor(
        private authService : AuthService
    ) {

    }

    @Selector()
    static getAirlineVendor(state : vendors) {
        return state.vendors.find(el => el.vendor_type == "A");
    }

    @Selector()
    static getHotelVendor(state : vendors) {
        return state.vendors.find(el => el.vendor_type == "H");
    }

    @Action(SetVendor)
    setVendor(states : StateContext<vendors>, action : SetVendor) {

        return this.authService.getVendor(action.agencyId,action.type)
            .pipe(
                map(
                    (response) => {
                        let vendor = JSON.parse(response.data).data;
                        states.setState(patch({
                            vendors : vendor
                        }));
                    }
                )
            );

    }

}
