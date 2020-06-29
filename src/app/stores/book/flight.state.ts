import { State, Store, Action, StateContext, Selector, StateStream } from '@ngxs/store';
import { flightResult, flightSearchPayload, segmentsPayload, resultFare } from 'src/app/models/search/flight';
import { OneWayBookState } from './flight/oneway.state';
import { OneWaySearchState } from '../search/flight/oneway.state';
import { RoundTripSearchState } from '../search/flight/round-trip.state';
import { MultiCitySearchState } from '../search/flight/multi-city.state';
import { UserState } from '../user.state';
import { CompanyState } from '../company.state';
import { ModalController } from '@ionic/angular';


export interface flight{
    passengers: passenger[],
    selectedPassengers:passenger[]
}

//////////////////////////////////////////////

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
    traveller_id: number
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
    country_flag:string
    user_eligibility: user_eligibility
    published_fare: number
    uapi_params: uapi_params
    fare_response: fare_response
}

export interface kioskRequest {
    trip_mode: number
    fromValue: value
    toValue: value
    Segments: segmentsPayload[]
    onwardDate: string
    returnDate: number
    adultsType: number
    childsType: number
    infantsType: number
    travelType: number
    travelType2: number
    countryFlag: string
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
    DateOfBirth: string,
    PassportNo: string,
    PassportExpiry: string,
    Fare: resultFare
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

/////////////////////////////////////////////////////////

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
    total: number
    currency: string
}

export interface totalsummary {

}

/////////////////////////////////////////////////////////

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

export interface addPassenger {
    title: string
    firstname: string
    lastname: string
    dob: string
    ppnumber: string
    nationality: string
    ppexpdate: string
    ftnumber: string
}

export class SetFirstPassengers {
    static readonly type = "[flight_book] SetFirstPassengers";
    constructor(public type : string) {

    }
}

export class AddPassenger {
    static readonly type = "[flight_book] AddPassenger";
    constructor(public pass: addPassenger) {

    }
}

@State<flight>({
    name: 'flight_book',
    defaults: {
        passengers: [],
        selectedPassengers:[]
    },
    children: [
        OneWayBookState
    ]
})

export class FLightBookState {

    constructor(
        public store: Store,
        public modalCtrl : ModalController
    ) {

    }

    @Selector()
    static getPassengers(states: flight) : passenger[] {
        return states.passengers
    }

    @Selector()
    static getSelected(states: flight): number {
        return states.selectedPassengers.length;
    }

    @Action(AddPassenger)
    addPassenger(states: StateContext<flight>, action: AddPassenger) {

        const pass: passenger = {
            AddressLine1: null,
            City: null,
            CountryName: null,
            CountryCode: null,
            Email: null,
            onwardExtraServices: {
                Meal: [],
                MealTotal: 0,
                BagTotal: 0,
                Baggage: []
            },
            returnExtraServices: {
                Meal: [],
                MealTotal: 0,
                BagTotal: 0,
                Baggage: []
            },
            PaxType: 1,
            IsLeadPax: false,
            FirstName: action.pass.firstname,
            LastName: action.pass.lastname,
            ContactNo: null,
            Title: action.pass.title,
            Gender: null,
            GSTCompanyEmail: null,
            DateOfBirth: action.pass.dob,
            PassportNo: action.pass.ppnumber,
            PassportExpiry:action.pass.ppexpdate,
            Fare: this.store.selectSnapshot(OneWayBookState.getPassengerFare),
            GSTCompanyAddress: null,
            GSTCompanyContactNumber: null,
            GSTCompanyName: null,
            GSTNumber:null
        }

        let passengers = Object.assign([], states.getState().passengers);
        passengers.push(pass);

        states.patchState({
            passengers: passengers
        });

        this.modalCtrl.dismiss(null, null, 'passenger-details');
    }

    @Action(SetFirstPassengers)
    setFirstPassengers(states: StateContext<flight>, action: SetFirstPassengers) {

        let passengerCount: number = 0;

        switch (action.type) {
            case 'one-way': passengerCount = this.store.selectSnapshot(OneWaySearchState.getAdult); break; 
            case 'round-trip': passengerCount = this.store.selectSnapshot(RoundTripSearchState.getAdult); break; 
            case 'multi-city': passengerCount = this.store.selectSnapshot(MultiCitySearchState.getAdult); break; 
        }
        
        let passengers: passenger[] = new Array(passengerCount);

        passengers[0] = {
            AddressLine1: this.store.selectSnapshot(UserState.getAddress),
            City: this.store.selectSnapshot(UserState.getCity),
            CountryName: this.store.selectSnapshot(UserState.getCountryName),
            CountryCode: null,
            Email: this.store.selectSnapshot(UserState.getEmail),
            onwardExtraServices: {
                Meal: [],
                MealTotal: 0,
                BagTotal: 0,
                Baggage : []
            },
            returnExtraServices: {
                Meal: [],
                MealTotal: 0,
                BagTotal: 0,
                Baggage: []
            },
            PaxType: 1,
            IsLeadPax: true,
            FirstName: this.store.selectSnapshot(UserState.getFirstName),
            LastName: this.store.selectSnapshot(UserState.getLastName),
            ContactNo: this.store.selectSnapshot(UserState.getContact),
            DateOfBirth: this.store.selectSnapshot(UserState.getDOB),
            PassportNo: this.store.selectSnapshot(UserState.getPassportNo),
            PassportExpiry: this.store.selectSnapshot(UserState.getPassportExpiry),
            Title: this.store.selectSnapshot(UserState.getTitle) == 'Female' ? 'Ms' : 'Mr',
            Gender: this.store.selectSnapshot(UserState.getTitle) == 'Female' ? 2 : 1,
            GSTCompanyEmail: this.store.selectSnapshot(CompanyState.gstCompanyEmail),
            GSTCompanyAddress: this.store.selectSnapshot(CompanyState.gstCompanyAddress),
            GSTCompanyContactNumber: this.store.selectSnapshot(CompanyState.getContact),
            GSTCompanyName: this.store.selectSnapshot(CompanyState.getCompanyName),
            GSTNumber: this.store.selectSnapshot(CompanyState.gstNumber),
            Fare: this.store.selectSnapshot(OneWayBookState.getPassengerFare)
        }

        states.patchState({
            passengers : passengers
        });

    }
}