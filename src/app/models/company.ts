import { response } from './response';
import { user } from './user';

export interface companyResponse extends response {
    data : company[]
}

export interface company {
    id:number
    company_name: string
    company_address_line1: string
    company_address_line2: string
    phone_number: string
    payment_method: string
    cash_limits: cashLimit
    gst_details: gstDetails
    service_charges: charges
    markup_charges: charges
    city: string
    country_name: string
    country_code: string
    status: boolean
    company_email: string
    company_type: string
    agency_id: number
    company_logo: string
    permissions: string
    consolidator: consolidator[]
    credit_req: creditReq2[]
    PCC: null
    queue_number: null
    target_branch: null
    vendor_type: null
    pincode: null
    pan_number: null
    invoice_prefix: null
    expense: null
    rights_to_book: boolean
    travel_type: null
    leg: null
    need_approval: null
    tm_credit_online: number
    outsource_to_tripmidas: null
    createdAt: string
    updatedAt: string
    Users : user
}

export interface cashLimit{

}

export interface gstDetails{

}

export interface charges{

}

export interface consolidator{

}

export interface creditReq2{
    
}