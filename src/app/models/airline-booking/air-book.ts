import { response, bookingResponse } from '../response';

export interface airBookResponse extends response{
    data : airBookData;
}

export interface airBookData {
    response : airBookDataResponse;
}

export interface airBookDataResponse extends bookingResponse {
    B2B2BStatus : boolean
    response : airBook
}

export interface airBook{
    PNR: string
    BookingId: number
    SSRDenied: boolean
    SSRMessage: any
    Status: number
    IsPriceChanged: boolean
    IsTimeChanged: boolean
    FlightItinerary: Itinerary
    TicketStatus: 1
}

export interface Itinerary {
    
}

/////////////////////////////////////////////////////////////////

export interface airRequest{
    id: number
    passenger_details: passengerDetails
    trip_requests: tripRequests
    traveller_id: number
    assigned_to: any
    assigned_by: any
    status: string
    booking_mode: string
    customer_id: 81
    transaction_id: any
    user_id: 363
    managers: string[]
    trip_type: string
    comments: any
    vendor_id: number
    travel_date: string
    updatedAt: string
    createdAt: string
    cancellation_remarks: any
    reschedule_remarks: any
    purpose: any
    cancellation_charges: any
    credit_req: any
    parent_id: any
    approval_mail_cc: any
    onward_pnr: any
    return_pnr: any
}

export interface passengerDetails{

} 

export interface tripRequests{

}

