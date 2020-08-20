import { State, Store, Action, StateContext, Selector, StateStream } from '@ngxs/store';
import { flightResult, flightSearchPayload, segmentsPayload, resultFare } from 'src/app/models/search/flight';
import { OneWayBookState } from './flight/oneway.state';
import { OneWaySearchState } from '../search/flight/oneway.state';
import { RoundTripSearchState } from '../search/flight/round-trip.state';
import { MultiCitySearchState } from '../search/flight/multi-city.state';
import { UserState } from '../user.state';
import { CompanyState } from '../company.state';
import { ModalController } from '@ionic/angular';
import { DomesticBookState } from './flight/domestic.state';
import { MultiCityBookState } from './flight/multi-city.state';
import { InternationalBookState } from './flight/international.state';
import * as _ from 'lodash';
import { SearchState } from '../search.state';


export interface flight{
    passengers: passenger[],
    passengerCount: number,
    selectedPassengers: passenger[],

    risk: string,
    
    mail: string[],
    purpose: string,
    comment: string,

    fare: fareObj

    meal: bookmeal
    baggage: bookbaggage
    
    selectedService: string
    veg: boolean
    nonveg: boolean
}

//////////////////////////////////////////////

export interface bookmeal {
    onward: meal[]
    return: meal[]
}

export interface bookbaggage {
    onward: baggage[]
    return: baggage[]
}

export interface fareObj{
    AdditionalTxnFeeOfrd: number
    AdditionalTxnFeePub: number
    BaseFare: number
    PassengerCount: number
    PassengerType: number
    Tax: number
    TransactionFee: number
    YQTax: number
}

export interface sendRequest {
    passenger_details: passenger_details
    trip_requests: flightSearchPayload
    approval_mail_cc: string
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

export interface rt_sendRequest {
    passenger_details: rt_passenger_details
    trip_requests: flightSearchPayload
    approval_mail_cc: string[]
    status: string
    purpose: string
    booking_mode: string
    customer_id: number
    transaction_id: any
    user_id: number
    traveller_id: number
    managers: managers
    trip_type: string
    comments: string
    vendor_id: number
    travel_date: string
}

export interface int_sendRequest {
    passenger_details: int_passenger_details
    trip_requests: flightSearchPayload
    approval_mail_cc: string[]
    status: string
    purpose: string
    booking_mode: string
    customer_id: number
    transaction_id: any
    user_id: number
    traveller_id: number
    managers: managers
    trip_type: string
    comments: string
    vendor_id: number
    travel_date: string
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

export interface rt_passenger_details {
    kioskRequest: rt_kioskRequest
    passenger: passenger[]
    flight_details: flightResult[]
    country_flag: string
    user_eligibility: user_eligibility
    published_fare: number
    uapi_params: rt_uapi_params
    fare_response: rt_fare_response
}

export interface int_passenger_details {
    kioskRequest: rt_kioskRequest
    passenger: passenger[]
    flight_details: flightResult[]
    country_flag: string
    user_eligibility: user_eligibility
    published_fare: number
    uapi_params: uapi_params
    fare_response: fare_response
}

export interface kioskRequest {
    trip_mode: number
    fromValue: value
    toValue: value
    Segments?: segmentsPayload[]
    onwardDate: string
    returnDate: number
    adultsType: number
    childsType: number
    infantsType: number
    countryFlag: number
    tour?: string
}

export interface rt_kioskRequest {
    trip_mode: number
    fromValue: value
    toValue: value
    Segments?: segmentsPayload[]
    onwardDate: string
    returnDate: string
    adultsType: number
    childsType: number
    infantsType: number
    countryFlag: number
    tour?: string
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

export interface passenger extends addPassenger{
    AddressLine1:string,
    City: string,
    CountryName: string,
    CountryCode: string,
    Email: string,
    onwardExtraServices: services,
    returnExtraServices: services,
    PaxType: number,
    IsLeadPax: boolean,
    Gender: number,
    GSTCompanyEmail: string,
    GSTCompanyAddress: string,
    GSTCompanyContactNumber:string,
    GSTCompanyName: string,
    GSTNumber: string,
    Fare: fareObj
}

export interface services {
    Meal: []
    Baggage:baggage[]
    MealTotal: number
    BagTotal: number
}

export interface baggage {
    AirlineCode: string
    Origin: string
    Destination: string
    FlightNumber: string
    
    Description: number
    Code: string
    Weight: number
    Currency: string
    Price: number
    WayType: number
    option_label: string
}

export interface meal{
    AirlineCode: string
    Origin: string
    Destination: string
    FlightNumber: string

    AirlineDescription: string
    Code: string
    Description: number
    Currency: string
    Price: number
    WayType: number
    Quantity: number
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
    approverid?:string,
    msg: any
    company_type: string
}

export interface uapi_params {
    selected_plb_Value: selected_Value
    selected_Return_plb_Value: string
}

export interface rt_uapi_params {
    selected_plb_Value: selected_Value
    selected_Return_plb_Value:  selected_Value
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
    onwardfare: response_fare[][]
    charges_details: charges_details
    cancellation_risk: string
}

export interface rt_fare_response {
    published_fare: number
    onwardfare: response_fare[][]
    returnfare: response_fare[][]
    charges_details: charges_details
    cancellation_risk: string
}

export interface response_fare {
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
    service_charges: number
    sgst_Charges: number
    cgst_Charges: number
    igst_Charges: number

    vendor: vendor
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
    email : string
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
    fare?: faresummary
    total?:totalsummary
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
    Title: string,
    FirstName: string,
    LastName: string,
    DateOfBirth: string,
    ContactNo: string,
    PassportNo: string,
    PassportExpiry: string,

    nationality?: string,
    ftnumber?: string
}


////////////////////////////////////////////////////

export class SetFare {
    static readonly type = "[flight_book] SetFare";
    constructor(public fare1: resultFare, public fare2?: resultFare) {
    }
}

export class SetMeal {
    static readonly type = "[flight_book] SetMeal";
    constructor(public onward: meal[][] & meal[], public ret?: meal[][] & meal[]) {
    }
}

export class SetBaggage {
    static readonly type = "[flight_book] SetBaggage";
    constructor(public onward: baggage[][] & baggage[], public ret?: baggage[][] & baggage[]) {
    }
}

export class CancellationRisk {
    static readonly type = "[flight_book] CancellationRisk";
    constructor(public risk: string) {
    }
}

export class SetFirstPassengers {
    static readonly type = "[flight_book] SetFirstPassengers";
    constructor(public type : string) {

    }
}

export class AddPassenger {
    static readonly type = "[flight_book] AddPassenger";
    constructor(public pass: passenger) {

    }
}

export class EditPassenger {
    static readonly type = "[flight_book] AddPassenger";
    constructor(public pass: passenger,public pax : passenger) {

    }
}

export class DeletePassenger {
    static readonly type = "[flight_book] DeletePassenger";
    constructor(public pax: passenger) {

    }
}

export class SelectPassenger{
    static readonly type = "[flight_book] SelectPassenger";
    constructor(public pass: passenger) {

    }
}

export class DeselectPassenger {
    static readonly type = "[flight_book] DeselectPassenger";
    constructor(public pass: passenger) {

    }
}

export class MailCC {
    static readonly type = "[flight_book] MailCC";
    constructor(public mail: string[]) {

    }
}

export class Purpose {
    static readonly type = "[flight_book] Purpose";
    constructor(public purpose: string) {

    }
}

export class Comments {
    static readonly type = "[flight_book] Comment";
    constructor(public comment: string) {

    }
}

export class SelectService {
    static readonly type = "[flight_book] SelectService";
    constructor(public service : string) {

    }
}

export class SetVeg {
    static readonly type = "[flight_book] SetVeg";
    constructor(public veg: boolean) {

    }
}

export class SetNonVeg {
    static readonly type = "[flight_book] SetNonVeg";
    constructor(public nonveg: boolean) {

    }
}

@State<flight>({
    name: 'flight_book',
    defaults: {
        passengers: [],
        passengerCount: null,
        selectedPassengers: [],

        risk: null,
        
        mail: [],
        purpose: null,
        comment: null,
        fare: null,
        meal: {
            onward: null,
            return : null
        },
        baggage: {
            onward: null,
            return: null
        },
        selectedService: 'meal',
        veg: true,
        nonveg: true
    },
    children: [
        OneWayBookState,
        DomesticBookState,
        InternationalBookState,
        MultiCityBookState
    ]
})

export class FLightBookState {

    constructor(
        public store: Store,
        public modalCtrl : ModalController
    ) {

    }

    @Selector()
    static getCC(states: flight): string[] {
        return states.mail;
    }

    @Selector()
    static getPurpose(states: flight): string {
        return states.purpose;
    }

    @Selector()
    static getComment(states: flight): string {
        return states.comment;
    }

    @Selector()
    static getRisk(states: flight): string {
        return states.risk;
    }

    @Selector()
    static getPassengers(states: flight) : passenger[] {
        return states.passengers
    }

    @Selector()
    static getLeadPassenger(states: flight): passenger {
        return states.passengers[0]
    }

    @Selector()
    static getSelectedPassengers(states: flight): passenger[] {
        return states.selectedPassengers;
    }

    @Selector()
    static getSelected(states: flight): number {
        return states.selectedPassengers.length;
    }

    @Selector()
    static getCount(states: flight): number {
        return states.passengerCount;
    }

    @Selector()
    static getFare(states: flight): fareObj {
        return states.fare;
    }

    @Selector()
    static getOnwardMeals(states: flight): meal[] {
        return states.meal.onward;
    }

    @Selector()
    static getReturnMeals(states: flight): meal[] {
        return states.meal.return;
    }

    @Selector()
    static getOnwardBaggages(states: flight): baggage[] {
        return states.baggage.onward;
    }

    @Selector()
    static getReturnBaggages(states: flight): baggage[] {
        return states.baggage.return;
    }

    @Selector()
    static getSelectedService(states: flight): string {
        return states.selectedService;
    }

    @Selector()
    static getVeg(states: flight): boolean {
        return states.veg;
    }

    @Selector()
    static getNonVeg(states: flight): boolean {
        return states.nonveg;
    }

    @Action(SetVeg)
    setVeg(states: StateContext<flight>, action: SetVeg) {
        states.patchState({
            veg: action.veg
        });
    }

    @Action(SetNonVeg)
    setNonVeg(states: StateContext<flight>, action: SetNonVeg) {
        states.patchState({
            nonveg: action.nonveg
        });
    }

    @Action(SelectService)
    selectService(states: StateContext<flight>, action: SelectService) {
        states.patchState({
            selectedService: action.service
        });
    }

    @Action(SetMeal)
    setMeal(states: StateContext<flight>, action: SetMeal) {

        let onward: meal[] = null;
        let ret: meal[] = null;

        if (action.onward != null || action.onward != undefined) {
            if (action.onward.some((el : meal[]) => Array.isArray(el))) {
                onward = _.flattenDeep(action.onward);
            }
            else {
                onward = action.onward;
            }
            onward = onward.filter(el => el.hasOwnProperty('Price') && el.hasOwnProperty('Quantity') && el.Price !== 0 && el.Quantity !== 0);
        }

        if (action.ret != null || action.ret != undefined) {
            if (action.ret.some((el: meal[]) => Array.isArray(el))) {
                ret = _.flattenDeep(action.ret);
            }
            else {
                ret = action.ret;
            }
            ret = ret.filter(el => el.hasOwnProperty('Price') && el.hasOwnProperty('Quantity') && el.Price !== 0 && el.Quantity !== 0);
        }


        states.patchState({
            meal: {
                onward: onward,
                return: ret
            }
        });
    }

    @Action(SetBaggage)
    setBaggage(states: StateContext<flight>, action: SetBaggage) {

        let onward: baggage[] = null;
        let ret: baggage[] = null;

        if (action.onward != null || action.onward != undefined) {
            if (action.onward.some((el: baggage[]) => Array.isArray(el))) {
                onward = _.flattenDeep(action.onward);
            }
            else {
                onward = action.onward;
            }
            onward = onward.filter(el => el.hasOwnProperty('Price') && el.hasOwnProperty('Weight') && el.Price !== 0 && el.Weight !== 0);
        }

        if (action.ret != null || action.ret != undefined) {
            if (action.ret.some((el: baggage[]) => Array.isArray(el))) {
                ret = _.flattenDeep(action.ret);
            }
            else {
                ret = action.ret;
            }
            ret = ret.filter(el => el.hasOwnProperty('Price') && el.hasOwnProperty('Weight') &&  el.Price !== 0 && el.Weight !== 0);
        }

        states.patchState({
            baggage: {
                onward: onward,
                return: ret
            }
        });
    }

    @Action(SetFare)
    setFare(states: StateContext<flight>, action: SetFare) {

        if (action.fare2) {
            let result: fareObj = {
                AdditionalTxnFeeOfrd: action.fare1.AdditionalTxnFeeOfrd + action.fare2.AdditionalTxnFeeOfrd,
                AdditionalTxnFeePub: action.fare1.AdditionalTxnFeePub + action.fare2.AdditionalTxnFeePub,
                BaseFare: action.fare1.BaseFare + action.fare2.BaseFare,
                PassengerCount: this.passCount(this.store.selectSnapshot(SearchState.getSearchType)),
                PassengerType: 1,
                Tax: action.fare1.Tax + action.fare2.Tax,
                TransactionFee: 0,
                YQTax: action.fare1.YQTax + action.fare2.YQTax
            }
            states.patchState({
                fare: result
            });
        }
        else {
            let result: fareObj = {
                AdditionalTxnFeeOfrd: action.fare1.AdditionalTxnFeeOfrd,
                AdditionalTxnFeePub: action.fare1.AdditionalTxnFeePub,
                BaseFare: action.fare1.BaseFare,
                PassengerCount: this.passCount(this.store.selectSnapshot(SearchState.getSearchType)),
                PassengerType: 1,
                Tax: action.fare1.Tax,
                TransactionFee: 0,
                YQTax: action.fare1.YQTax
            }
            states.patchState({
                fare: result
            });
        }

    }

    @Action(AddPassenger)
    addPassenger(states: StateContext<flight>, action: AddPassenger) {

        let passengers = Object.assign([], states.getState().passengers);
        passengers.push(action.pass);
        passengers = _.uniqBy(passengers,passengers);

        states.patchState({
            passengers: passengers
        });

        this.modalCtrl.dismiss(null, null, 'passenger-details');
    }

    @Action(EditPassenger)
    editPassenger(states: StateContext<flight>, action: EditPassenger) {

        let passengers: passenger[] = Object.assign([], states.getState().passengers);
        let filterPass: passenger[] = passengers.filter(el => !_.isEqual(el, action.pax));
        filterPass.push(action.pass);

        states.patchState({
            passengers: filterPass
        });

        this.modalCtrl.dismiss(null, null, 'passenger-details');
    }

    @Action(DeletePassenger)
    deletePassenger(states: StateContext<flight>, action: DeletePassenger) {

        let passengers: passenger[] = Object.assign([], states.getState().passengers);
        let filterPass: passenger[] = passengers.filter(el => !_.isEqual(el, action.pax));

        states.patchState({
            passengers: filterPass
        });
    }

    @Action(SetFirstPassengers)
    setFirstPassengers(states: StateContext<flight>, action: SetFirstPassengers) {

        let passengerCount: number = 0;

        switch (action.type) {
            case 'one-way': passengerCount = this.store.selectSnapshot(OneWaySearchState.getAdult); break; 
            case 'round-trip': passengerCount = this.store.selectSnapshot(RoundTripSearchState.getAdult); break; 
            case 'multi-city': passengerCount = this.store.selectSnapshot(MultiCitySearchState.getAdult); break; 
        }
        
        let passengers: passenger[] = [];

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
            LastName: this.store.selectSnapshot(UserState.getLastName) == null ? '' : this.store.selectSnapshot(UserState.getLastName),
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
            Fare: states.getState().fare
        }

        states.patchState({
            passengers: passengers,
            passengerCount: passengerCount
        });

    }

    @Action(SelectPassenger)
    selectPassenger(states: StateContext<flight>, action: SelectPassenger) {
        let passArray: passenger[] = Object.assign([], states.getState().selectedPassengers);
        passArray.push(action.pass);
        states.patchState({
            selectedPassengers: passArray
        });
    }

    @Action(DeselectPassenger)
    deselectPassenger(states: StateContext <flight>, action: DeselectPassenger) {
        let passArray = Object.assign([], states.getState().selectedPassengers);
        const currentArray = passArray.filter(el => el !== action.pass);
        states.patchState({
            selectedPassengers: currentArray
        });
    }

    @Action(CancellationRisk)
    cancellationRisk(states: StateContext<flight>, action: CancellationRisk) {
        states.patchState({
            risk: action.risk
        });
    }

    @Action(MailCC)
    mailCC(states: StateContext<flight>, action: MailCC) {
        states.patchState({
            mail: action.mail
        });
    }

    @Action(Purpose)
    purpose(states: StateContext<flight>, action: Purpose) {
        states.patchState({
            purpose: action.purpose
        });
    }

    @Action(Comments)
    comment(states: StateContext<flight>, action: Comments) {
        states.patchState({
            comment: action.comment
        });
    }

    getGender(title : string) : number {
        if (title == 'Mstr' || title == 'Mr')
        {
            return 1;
        }
        else {
            return 2;
        }
    }


    passCount(type: string) : number {
        let passengerCount = 0;
        switch (type) {
            case 'one-way': passengerCount = this.store.selectSnapshot(OneWaySearchState.getAdult); break;
            case 'round-trip': passengerCount = this.store.selectSnapshot(RoundTripSearchState.getAdult); break;
            case 'multi-city': passengerCount = this.store.selectSnapshot(MultiCitySearchState.getAdult); break;
        }
        return passengerCount;
    }

}