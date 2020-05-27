
//request flight
export interface flightSearchPayload{
    AdultCount: string
    ChildCount: string
    InfantCount: string
    //type of journey oneway=1;roundtrip=2;multicity=3
    JourneyType: number
    //flight departure and return details array
    Segments: segmentsPayload[]
    prefferedAirline: any[]
    sources: string[]
}

export interface segmentsPayload{
    Destination: string
    FlightCabinClass: string
    Origin: string
    PreferredArrivalTime: string
    PreferredDepartureTime: string
}

//response flight

export interface flightSearchResponse{
    response : flightSearchResult
}

export interface flightSearchResult{
    Destination: string
    Error: flightSearchError
    Origin: string
    ResponseStatus: number
    Results: flightResult[][]
    TraceId: string
}

export interface flightSearchError{
    ErrorCode: number
    ErrorMessage: string
}

export interface flightResult {
    AirlineCode: string
    AirlineRemark: string
    Fare: resultFare
    FareBreakdown: fareBreakDown[]
    FareCombinationId: any
    FareRules: fareRule[]
    GSTAllowed: boolean
    IsCouponAppilcable: boolean
    IsGSTMandatory: boolean
    IsHoldAllowedWithSSR: boolean
    IsLCC: boolean
    IsPanRequiredAtBook: boolean
    IsPanRequiredAtTicket: boolean
    IsPassportRequiredAtBook: boolean
    IsPassportRequiredAtTicket: boolean
    IsRefundable: boolean
    LastTicketDate: any
    ResultIndex: string
    Segments: segments[][]
    Source: number
    TicketAdvisory: any
    ValidatingAirline: string
}

export interface resultFare{
    AdditionalTxnFeeOfrd: number
    AdditionalTxnFeePub: number
    BaseFare: number
    ChargeBU: chargeBU[]
    CommissionEarned: number
    Currency: string
    Discount: number
    IncentiveEarned: number
    OfferedFare: number
    OtherCharges: number
    PGCharge: number
    PLBEarned: number
    PublishedFare: number
    ServiceFee: number
    Tax: number
    TaxBreakup: TaxBreakup
    TdsOnCommission: number
    TdsOnIncentive: number
    TdsOnPLB: number
    TotalBaggageCharges: number
    TotalMealCharges: number
    TotalSeatCharges: number
    TotalSpecialServiceCharges: number
    YQTax: number
}

export interface chargeBU {
    key: string
    value: number
}

export interface TaxBreakup{
    key: string
    value: number
}

export interface fareBreakDown{
    AdditionalTxnFeeOfrd: number
    AdditionalTxnFeePub: number
    BaseFare: number
    Currency: string
    PGCharge: number
    PassengerCount: number
    PassengerType: number
    Tax: number
    YQTax: number
}

export interface fareRule{
    Airline: string
    Destination: string
    FareBasisCode: string
    FareFamilyCode: string
    FareRestriction: string
    FareRuleDetail: string
    FareRuleIndex: string
    Origin: string
}

export interface segments{
    Airline: airLine
    Baggage: string
    CabinBaggage: string
    CabinClass: string
    Craft: string
    Destination: destination
    Duration: number
    FlightInfoIndex: string
    FlightStatus: string
    GroundTime: number
    IsETicketEligible: boolean
    Mile: number
    NoOfSeatAvailable: number
    Origin: origin
    Remark: any
    SegmentIndicator: number
    Status: string
    StopOver: boolean
    StopPoint: string
    StopPointArrivalTime: any
    StopPointDepartureTime: any
    TripIndicator: number
}

export interface airLine{
    AirlineCode: string
    AirlineName: string
    FareClass: string
    FlightNumber: string
    OperatingCarrier: string
}

export interface destination{
    Airport: airport
    ArrTime: string
}

export interface origin {
    Airport: airport
    ArrTime: string
}

export interface airport {
    AirportCode: string
    AirportName: string
    CityCode: string
    CityName: string
    CountryCode: string
    CountryName: string
    Terminal: string
}