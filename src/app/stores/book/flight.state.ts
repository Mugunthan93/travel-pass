import { State, Action, StateContext, Selector, StateStream, Store } from '@ngxs/store';
import { SSR } from '../result/flight.state';
import { flightResult, flightData, flightSearchPayload } from 'src/app/models/search/flight';
import * as moment from 'moment';
import { CompanyState } from '../company.state';


export interface flight{
    flight: bookObj,
    baggage: baggageresponse[][],
    meal: mealDynamic[][],
    seat: SegmentSeat[],
    specialServices: any[]
}

export interface sendRequest {
    passenger_details: passenger_details
    trip_requests: flightSearchPayload
    approval_mail_cc: []
    status: string
    purpose: string
    booking_mode: string
    customer_id: number
    transaction_id: any
    user_id: number
    managers:managers
    trip_type: string
    comments: string
    vendor_id: number
    travel_date:string   
}

export interface passenger_details {
    kioskRequest: kioskRequest
    passenger:passenger[]
    flight_details: flightResult[]
    country_flag:number
    user_eligibility: user_eligibility
    published_fare: number
    uapi_params: uapi_params
    fare_response: fare_response
}

export interface kioskRequest {
    trip_mode: number
    fromValue: value
    toValue: value
    onwardDate: string
    returnDate: number
    adultsType: number
    childsType: number
    infantsType: number
    travelType: number
    travelType2: number
    countryFlag: number
    tour: number
}

export interface value {
    airportCode: string
    airportName: string
    cityName: string
    cityCode: string
    countryCode: string
    countryName: string
    currency: string
    nationalty: string
    option_label: string
}

export interface passenger{
    AddressLine1:string,
    City: string,
    CountryName: string,
    CountryCode: string,
    Email: string,
    onwardExtraServices: services,
    returnExtraServices: services,
    PaxType: number,
    IsLeadPax: boolean,
    FirstName: string,
    ContactNo: string,
    Title: string,
    Gender: number,
    GSTCompanyEmail: string,
    GSTCompanyAddress: string,
    GSTCompanyContactNumber:string,
    GSTCompanyName: string,
    GSTNumber: string,
    LastName: string,
    DateOfBirth:string,
    Fare: fare
}

export interface services {
    Meal: []
    Baggage:baggage[]
    MealTotal: number
    BagTotal: number
}

export interface baggage {
    AirlineCode: string
    FlightNumber: string
    WayType: number
    Code: string
    Description: number
    Weight: number
    Currency: string
    Price: number
    Origin: string
    Destination: string
    option_label:string
}

export interface fare {
    TransactionFee: number
    AdditionalTxnFeePub: number
    AdditionalTxnFeeOfrd: number
    PassengerCount: number
    PassengerType: number
    BaseFare: number
    YQTax: number
    Tax: number
}

export interface user_eligibility {
    msg: any
    company_type: string
}

export interface uapi_params {
    selected_plb_Value: selected_Value
    selected_Return_plb_Value: selected_Value
}

export interface selected_Value {
    K3: number
    PLB_earned: number
    queuenumber: number
    PCC: number
    consolidator_name: string
    vendor_id: number
}

export interface fare_response {
    published_fare: number
    onwardfare: onwardfare[][]
    charges_details: charges_details
    cancellation_risk: string
}

export interface onwardfare {
    basefare: number
    yqtax: number
    tax: number
    total_amount: number
    IsPriceChanged: boolean
    FareBasisCode: string
    details: details
    PassengerType: number
    PassengerCount: number
}

export interface charges_details {
    vendor: vendor
    service_charges: number
    sgst_Charges: number
    cgst_Charges: number
    igst_Charges: number
    total_amount: number
    markup_charges: number
    other_taxes: number
    agency_markup: number
    GST_total: number
    sgst_onward: number
    cgst_onward: number
    igst_onward: number
    sgst_return: number
    cgst_return: number
    igst_return: number
    onward_markup: number
    return_markup: number
}

export interface vendor {
    service_charges: number
    GST : number
}

export interface details {
    TransactionFee: number
    AdditionalTxnFeePub: number
    AdditionalTxnFeeOfrd: number
    PassengerCount: number
    PassengerType: number
    BaseFare: number
    YQTax: number
    Tax: number
}

export interface managers{
    id: number
    name: string
    mail : string
}

export interface bookObj{ 
    summary:summary
    trip : trip[]
}

export interface trip {
    origin: string,
    destination: string
    connecting_flight:connectingFlight[]
}

export interface connectingFlight {
    origin: connectingDetail
    destination: connectingDetail
    duration: string
    airline: {
        name: string
        code: string
        number: string
    }
}

export interface connectingDetail {
    name: string
    code: string
    date: string
    terminal: string
}

export interface summary{
    fare: faresummary
    total:totalsummary
}

export interface faresummary {
    base: number
    taxes:number
}

export interface totalsummary {
    serviceCharge: number
    SGST: number
    CGST: number
    IGST: number
    flight: number
    k3: number
    other: number
    extraMeals: number
    extraBaggage: number
}

export interface totalsummary {

}

export interface baggageresponse {
    AirlineCode: string
    Code: string
    Currency: string
    Description: number
    Destination: string
    FlightNumber: string
    Origin: string
    Price: number
    WayType: number
    Weight: number
}

export interface mealDynamic {
    AirlineCode: string
    AirlineDescription: string
    Code: string
    Currency: string
    Description: number
    Destination: string
    FlightNumber: string
    Origin: string
    Price: number
    Quantity: number
    WayType: number
}

export interface SegmentSeat {
    SegmentSeat: rowseats[]
}

export interface rowseats{
    rowseats : seats[]
}

export interface seats {
    seats : seat[]
}

export interface seat{
    AirlineCode: string
    AvailablityType: number
    Code: string
    Compartment: number
    CraftType: string
    Currency: string
    Deck: number
    Description: number
    Destination: string
    FlightNumber: string
    Origin: string
    Price: number
    RowNo: any
    SeatNo: string
    SeatType: number
    SeatWayType: number
}

export class GetFlightDetail{
    static readonly type = "[flight] GetFlightDetail";
    constructor(public fairQuote: flightResult, public ssr: SSR) {

    }
}

@State<flight>({
    name: 'flight',
    defaults: {
        flight: null,
        baggage: null,
        meal: null,
        seat: null,
        specialServices:null
    }
})

export class FLightBookState {

    @Selector()
    static getFlightDetail(states: flight): bookObj {
        return states.flight;
    }

    constructor(
        private store : Store
    ) {

    }

    @Action(GetFlightDetail)
    getFlightDetail(states: StateContext<flight>, action: GetFlightDetail) {
        
        states.patchState({
            flight: this.bookData(action.fairQuote),
            baggage: action.ssr.Baggage,
            meal: action.ssr.MealDynamic,
            seat: action.ssr.SeatDynamic,
            specialServices:action.ssr.specialServices
        });
    }

    bookData(data: flightResult): bookObj {

        let flightFare: number = data.Fare.PublishedFare - (data.Fare.TaxBreakup[0].value - data.Fare.OtherCharges);
        let domesticCharge: number = this.store.selectSnapshot(CompanyState.getDomesticCharge);
        let internationalCharge: number = this.store.selectSnapshot(CompanyState.getInternationalCharge);

        let book: bookObj = {
            summary: {
                fare: {
                    base: data.Fare.BaseFare,
                    taxes:data.Fare.Tax
                },
                total: {
                    serviceCharge: null,
                    SGST: null,
                    CGST: null,
                    IGST: null,
                    flight: flightFare,
                    k3: data.Fare.TaxBreakup[0].value,
                    other: data.Fare.OtherCharges,
                    extraMeals: null,
                    extraBaggage: null,
                }
                
            },
            trip : []
        };

        data.Segments.forEach(
            (element: flightData[], index: number, arr: flightData[][]) => {
                book.trip[index] = {
                    origin: element[index].Origin.Airport.CityName,
                    destination: element[index].Destination.Airport.CityName,
                    connecting_flight: []
                }

                element.forEach(
                    (el: flightData, ind: number, arr: flightData[]) => {

                        book.trip[index].connecting_flight[ind] = {
                            airline: {
                                name: el.Airline.AirlineName,
                                code: el.Airline.AirlineCode,
                                number: el.Airline.FlightNumber
                            },
                            origin: {
                                name: el.Origin.Airport.CityName,
                                code: el.Origin.Airport.CityCode,
                                date: el.Origin.DepTime,
                                terminal:el.Origin.Airport.Terminal
                            },
                            destination: {
                                name: el.Destination.Airport.CityName,
                                code: el.Destination.Airport.CityCode,
                                date: el.Destination.ArrTime,
                                terminal: el.Destination.Airport.Terminal
                            },
                            duration: moment.duration(el.Duration, 'minutes').days() + "d " + moment.duration(el.Duration, 'minutes').hours() + "h " + moment.duration(el.Duration, 'minutes').minutes() + "m"
                        }
                    }
                );
            }
        );

        return book;
    }
}