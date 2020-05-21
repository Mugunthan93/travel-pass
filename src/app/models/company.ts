import { user } from './user';

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
    corp_code:corpCode[]
    permissions: string
    consolidator: consolidator[]
    credit_req: creditReq[]
    expense: boolean
    rights_to_book: boolean
    travel_type: travelType
    leg: Leg
    need_approval: boolean
    tm_credit_online: number
    outsource_to_tripmidas: boolean
    createdAt: string
    updatedAt: string
    Users: user[]
    
    CCODE: any
    SCODE: any
    PCC: any
    queue_number: any
    target_branch: any
    vendor_type: any
    pincode: any
    pan_number: any
    invoice_prefix: any
}

export interface cashLimit{
    amount: number
    days: string
}

export interface gstDetails{
    cancellation_at_risk: string
    email: string
    gstNo: string
    phoneNumber: string
}

export interface charges{
    domesticCharge: number
    internationalCharge: number
    serviceBusCharge: number
    serviceCarCharge: number
    serviceHotelCharge: number
    state_name: string
}

export interface consolidator{

}

export interface creditReq{
    
}

export interface corpCode{
    airlineCode: string
    airlineName: string
    corpCode: string
}

export interface Leg {
    isMultileg: boolean
    isSingleleg: boolean
}

export interface travelType {
    isDomestic: boolean
    isInternational: boolean
}