import { bookingResponse, response } from '../response';

/////////////////////////////////////////////////

export interface airSearchResponse extends response{
    data : airSearchData;
}

export interface airSearchData {
    response : airSeachDataResponse;
}

export interface airSeachDataResponse extends bookingResponse {
    Origin: string
    Destination: string
    Results : airSearch[]
}

export interface airSearch {
    IsHoldAllowedWithSSR: boolean
    ResultIndex: string
    Source: number
    IsLCC: boolean
    IsRefundable: boolean
    GSTAllowed: boolean
    IsCouponAppilcable: boolean
    IsGSTMandatory: boolean
    AirlineRemark: string
    Fare: fare
    FareBreakdown:fareBreakDown[]
    Segments:segments[]
    LastTicketDate: string
    TicketAdvisory: null
    FareRules: fareRules[]
    AirlineCode: string
    ValidatingAirline: string
}

//////////////////////////////////////////////////

export interface fare{

}

export interface fareBreakDown{

}

export interface segments{

}

export interface fareRules{

}