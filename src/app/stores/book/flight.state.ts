import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { flightResult, flightSearchPayload, segmentsPayload, resultFare } from 'src/app/models/search/flight';
import { OneWayBookState } from './flight/oneway.state';
import { OneWaySearchState } from '../search/flight/oneway.state';
import { RoundTripSearchState } from '../search/flight/round-trip.state';
import { MultiCitySearchState } from '../search/flight/multi-city.state';
import { ModalController } from '@ionic/angular';
import { DomesticBookState } from './flight/domestic.state';
import { MultiCityBookState } from './flight/multi-city.state';
import { InternationalBookState } from './flight/international.state';
import * as _ from 'lodash';
import { SearchState, SearchType } from '../search.state';
import { flightpassenger } from '../passenger/flight.passenger.states';
import { Injectable } from '@angular/core';
import { FlightService } from 'src/app/services/flight/flight.service';
import { patch } from '@ngxs/store/operators';
import { map } from 'rxjs/operators';
import { AgencyState } from '../agency.state';
import { CompanyState } from '../company.state';
import { forkJoin } from 'rxjs';


export interface flight{

    risk: string,
    mail: string[],
    purpose: string,
    comment: string,

    fare: {
      onward : fareObj,
      return : fareObj,
      total : fareObj
    }

    meal: bookmeal
    baggage: bookbaggage

    selectedService: string
    veg: boolean
    nonveg: boolean

    plb : {
      onward : plb[],
      return : plb[]
    }
    gst : {
      onward : GST,
      return : GST
    }
    serviceCharge : number
    taxable : {
      onward : number,
      return : number
    }
}

//////////////////////////////////////////////

export interface servicebySegment {
    Origin: string;
    Destination: string;
    service: baggage[] | meal[];
}

export interface taxes {
    INTax: number
    K3: number
    OtherTaxes: number
    PSF: number
    TransactionFee: number
    UDF: number
    YQTax: number
    YR: number
}

export interface plb {
    airline_code: string
    airline_name: string
    class: string
    consolidator: string
    createdAt: string
    customer_id: number
    formula: string
    iata_code: number
    id: number
    percent: number
    plbnotvalid: string
    remarks: any
    service_charge: number
    trip_type: string
    updatedAt: string
    user_id: number
    validity_date: any
    way: string
}

export interface GST {
    cgst: number,
    sgst: number,
    igst: number
}

export interface bookpayload {
    Passengers: bookpassenger[],
    TraceId: string,
    JourneyType: boolean,
    IsLCC: boolean,
    ResultIndex: string
}

export interface bookpassenger {
    AddressLine1: string,
    City: string,
    CountryName: string,
    CountryCode: string,
    Email: string,
    PaxType: number,
    IsLeadPax: boolean,
    FirstName: string,
    LastName: string,
    ContactNo: string,
    DateOfBirth: string,
    Title: string,
    Gender: number,
    Fare: {
      TransactionFee: number,
      AdditionalTxnFeePub: number,
      AdditionalTxnFeeOfrd: number,
      PassengerCount: number,
      PassengerType: number,
      BaseFare: number,
      YQTax: number,
      Tax: number
    }
}

export interface ticketpayload {
    user_id: number,
    airline_request_id: number,
    pnr: string,
    booking_id: string,
    booking_status: string,
    published_fare: number,
    offered_fare: number,
    collected_fare: number,
    ticket_status: string,
    email_notify: boolean
  }

export interface bookmeal {
    onward: servicebySegment[]
    return: servicebySegment[]
}

export interface bookbaggage {
    onward: servicebySegment[]
    return: servicebySegment[]
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
    ///AdMarkup : number
}

export interface sendRequest {
    passenger_details: passenger_details
    trip_requests: flightSearchPayload
    approval_mail_cc?: string[]
    status: string
    purpose?: string
    booking_mode: string
    customer_id: number
    transaction_id: any
    user_id: number
    traveller_id: number
    managers: string[] | managers
    trip_type: string
    comments: string
    vendor_id: number
    travel_date:string
}

export interface rt_sendRequest {
    passenger_details: rt_passenger_details
    trip_requests: flightSearchPayload
    approval_mail_cc?: string[]
    status: string
    purpose?: string
    booking_mode: string
    customer_id: number
    transaction_id: any
    user_id: number
    traveller_id: number
    managers: string[] | managers
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
    managers: string[]
    trip_type: string
    comments: string
    vendor_id: number
    travel_date: string
}

export interface passenger_details {
    kioskRequest: kioskRequest
    passenger:flightpassenger[]
    fareQuoteResults? : flightResult[],
    flight_details: flightResult[]
    country_flag:string
    user_eligibility: user_eligibility
    published_fare: number
    uapi_params: uapi_params
    fare_response: fare_response
}

export interface rt_passenger_details {
    kioskRequest: rt_kioskRequest
    passenger: flightpassenger[]
    fareQuoteResults : flightResult[]
    flight_details: flightResult[]
    country_flag: string
    user_eligibility: user_eligibility
    published_fare: number
    uapi_params: rt_uapi_params
    fare_response: rt_fare_response
}

export interface int_passenger_details {
    kioskRequest: rt_kioskRequest
    passenger: flightpassenger[]
    fareQuoteResults : flightResult[]
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
    travelType?: number
    travelType2?: number
    client : null
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
    travelType?: number
    travelType2?: number
    client : any

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
    client?: null
}

export interface services {
    Meal: meal[]
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
    option_label?: string
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
    taxable_fare : number
}

export interface vendor {
    service_charges: number
    GST : number
    CGST : number
    SGST : number
    IGST : number
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
    total?:totalsummary[]
}

export interface faresummary {
    base: number
    taxes:number
    ot : number
}

export interface totalsummary {
    id : number
    source : string
    destination : string
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


////////////////////////////////////////////////////

export class SetFare {
    static readonly type = "[flight_book] SetFare";
    constructor(public fare1: resultFare, public fare2?: resultFare) {
    }
}

export class SetMeal {
    static readonly type = "[flight_book] SetMeal";
    constructor(public onward:  servicebySegment[], public ret?:  servicebySegment[]) {
    }
}

export class SetBaggage {
    static readonly type = "[flight_book] SetBaggage";
    constructor(public onward: servicebySegment[], public ret?:  servicebySegment[]) {
    }
}

export class CancellationRisk {
    static readonly type = "[flight_book] CancellationRisk";
    constructor(public risk: string) {
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

export class GetPLB {
    static readonly type = "[OneWay] GetPLB";
    constructor(public fareQuote1 : any,public fareQuote2?:any) {

    }
}

export class SetServiceCharge {
    static readonly type = "[OneWay] SetServiceCharge";
}

export class SetGST {
    static readonly type = "[OneWay] SetGST";
}

export class SetTaxable {
    static readonly type = "[OneWay] SetTaxable";
}

@State<flight>({
    name: 'flight_book',
    defaults: {
        risk: null,
        mail: [],
        purpose: null,
        comment: null,

        fare: {
          onward : null,
          return : null,
          total : null
        },
        meal: {
            onward: [],
            return : []
        },
        baggage: {
            onward: [],
            return: []
        },
        selectedService: 'meal',
        veg: true,
        nonveg: true,

        plb : {
          onward : [],
          return : []
        },
        gst : {
          onward : null,
          return : null
        },
        serviceCharge : 0,
        taxable : {
          onward : 0,
          return : 0
        }
    },
    children: [
        OneWayBookState,
        DomesticBookState,
        InternationalBookState,
        MultiCityBookState
    ]
})


@Injectable()
export class FLightBookState {

    constructor(
        public store: Store,
        public modalCtrl : ModalController,
        public flightService : FlightService
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
    static getFare(states: flight): { onward : fareObj, return : fareObj } {
        return states.fare;
    }

    @Selector()
    static getOnwardMeals(states: flight): servicebySegment[] {
        return states.meal.onward;
    }

    @Selector()
    static getReturnMeals(states: flight): servicebySegment[] {
        return states.meal.return;
    }

    @Selector()
    static getOnwardBaggages(states: flight): servicebySegment[] {
        return states.baggage.onward;
    }

    @Selector()
    static getReturnBaggages(states: flight): servicebySegment[] {
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

    @Selector()
    static getPLB(states: flight): {onward : plb[], return : plb[]} {
        return states.plb;
    }

    @Selector()
    static getGST(states: flight): {onward : GST, return : GST} {
        return states.gst;
    }

    @Selector()
    static getServiceCharge(states: flight): number {
        return states.serviceCharge
    }

    @Selector()
    static getTaxable(states: flight): {onward : number, return : number} {
        return states.taxable;
    }

    @Action(GetPLB)
    getPLB(states: StateContext<flight>, action: GetPLB) {

      if(action.fareQuote2) {
        let code1 = action.fareQuote1.AirlineCode;
        let code2 = action.fareQuote2.AirlineCode;
        let cls = this.getCabinClass();
        let type = this.getTripType();

        let plb1 = this.flightService.getPLB(code1,cls,type);
        let plb2 = this.flightService.getPLB(code2,cls,type);

        return forkJoin([plb1,plb2])
          .pipe(
            map(
              (response) => {
                let onplb = JSON.parse(response[0].data);
                let replb = JSON.parse(response[1].data);
                states.setState(patch({
                  plb : patch({
                    onward : onplb,
                    return : replb
                  })
              }));
              }
            )
        );
      }
      else {

        let code = action.fareQuote1.AirlineCode;
        let cls = this.getCabinClass();
        let type = this.getTripType();

        return this.flightService.getPLB(code,cls,type)
            .pipe(
                map(
                    (response) => {
                        let plb : plb[] = JSON.parse(response.data);
                        states.setState(patch({
                            plb : patch({
                              onward : plb
                            })
                        }));
                    }
                )
            );

      }

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

        let onward: meal[] = [];
        let ret: meal[] = [];

        states.patchState({
            meal: {
                onward: action.onward,
                return: action.ret
            }
        });
    }

    @Action(SetBaggage)
    setBaggage(states: StateContext<flight>, action: SetBaggage) {

        let onward: baggage[] = [];
        let ret: baggage[] = [];

        states.patchState({
            baggage: {
                onward: action.onward,
                return: action.ret
            }
        });
    }

    @Action(SetFare)
    setFare(states: StateContext<flight>, action: SetFare) {

        if (action.fare2) {
            let fare1 : fareObj = {
                AdditionalTxnFeeOfrd: action.fare1.AdditionalTxnFeeOfrd,
                AdditionalTxnFeePub: action.fare1.AdditionalTxnFeePub,
                BaseFare: action.fare1.BaseFare,
                PassengerCount: action.fare1.PassengerCount,
                PassengerType: 1,
                Tax: action.fare1.Tax,
                TransactionFee: 0,
                YQTax: action.fare1.YQTax
            };
            let fare2 : fareObj = {
                AdditionalTxnFeeOfrd: action.fare2.AdditionalTxnFeeOfrd,
                AdditionalTxnFeePub: action.fare2.AdditionalTxnFeePub,
                BaseFare: action.fare2.BaseFare,
                PassengerCount: action.fare2.PassengerCount,
                PassengerType: 1,
                Tax: action.fare2.Tax,
                TransactionFee: 0,
                YQTax: action.fare2.YQTax
            };
            let result: fareObj = {
                AdditionalTxnFeeOfrd: action.fare1.AdditionalTxnFeeOfrd + action.fare2.AdditionalTxnFeeOfrd,
                AdditionalTxnFeePub: action.fare1.AdditionalTxnFeePub + action.fare2.AdditionalTxnFeePub,
                BaseFare: action.fare1.BaseFare + action.fare2.BaseFare,
                PassengerCount: action.fare1.PassengerCount,
                PassengerType: 1,
                Tax: action.fare1.Tax + action.fare2.Tax,
                TransactionFee: 0,
                YQTax: action.fare1.YQTax + action.fare2.YQTax
            }
            states.setState(patch({
                fare: patch({
                  onward : fare1,
                  return : fare2,
                  total : result
                })
            }));
        }
        else {
            let result: fareObj = {
                AdditionalTxnFeeOfrd: action.fare1.AdditionalTxnFeeOfrd,
                AdditionalTxnFeePub: action.fare1.AdditionalTxnFeePub,
                BaseFare: action.fare1.BaseFare,
                PassengerCount: action.fare1.PassengerCount,
                PassengerType: 1,
                Tax: action.fare1.Tax,
                TransactionFee: 0,
                YQTax: action.fare1.YQTax
            }
            states.setState(patch({
                fare : patch({
                  onward: result,
                  return : null,
                  total : result
                })
            }));
        }

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

    @Action(SetServiceCharge)
    setServiceCharge(states: StateContext<flight>) {
        states.setState(patch({
            serviceCharge : this.serviceCharges()
        }));
    }

    @Action(SetGST)
    setGST(states: StateContext<flight>) {
        states.setState(patch({
            gst : patch({
              onward : this.GST(states,"onward"),
              return : this.GST(states,"return")
            })
        }));
    }

    @Action(SetTaxable)
    setTaxable(states: StateContext<flight>) {

      if(states.getState().plb.onward.length >= 1 && states.getState().fare.onward !== null) {
        let onplb = states.getState().plb.onward[0];
        let onfare = states.getState().fare.onward.BaseFare;
        let onyq = states.getState().fare.onward.YQTax;

        states.setState(patch({
          taxable : patch({
            onward : this.getTaxable(onplb,onfare,onyq)
          })
      }));
      }

      if(states.getState().plb.onward.length >= 1 && states.getState().fare.onward != null) {
        let replb = states.getState().plb.return[0];
        let refare = states.getState().fare.return.BaseFare;
        let reyq = states.getState().fare.return.YQTax;

        states.setState(patch({
          taxable : patch({
            return : this.getTaxable(replb,refare,reyq)
          })
      }));

      }
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

    GST(states : StateContext<flight>, type : string) {

      let gstApplied = this.store.selectSnapshot(AgencyState.getGstApplied);
      let service = states.getState().serviceCharge;
      let taxable = states.getState().taxable;

      if(type == "onward") {
        if(gstApplied == 'Service Charge') {
          if (this.store.selectSnapshot(CompanyState.getStateName) == 'TN') {
              return {
                  cgst: (service * 9) / 100,
                  sgst: (service * 9) / 100,
                  igst: 0
              }
          }
          else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'TN') {
              return {
                  cgst: 0,
                  sgst: 0,
                  igst: (service * 18) / 100
              }
          }
        }
        else if(gstApplied == 'Ticket Price'){
            if (this.store.selectSnapshot(CompanyState.getStateName) == 'TN') {
                return {
                    cgst: (taxable.onward * 9) / 100,
                    sgst: (taxable.onward * 9) / 100,
                    igst: 0
                }
            }
            else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'TN') {
                return {
                    cgst: 0,
                    sgst: 0,
                    igst: (taxable.onward * 18) / 100
                }
            }
        }
      }
      else if(type == "return") {
        if(gstApplied == 'Service Charge') {
          if (this.store.selectSnapshot(CompanyState.getStateName) == 'TN') {
              return {
                  cgst: (service * 9) / 100,
                  sgst: (service * 9) / 100,
                  igst: 0
              }
          }
          else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'TN') {
              return {
                  cgst: 0,
                  sgst: 0,
                  igst: (service * 18) / 100
              }
          }
        }
        else if(gstApplied == 'Ticket Price'){
            if (this.store.selectSnapshot(CompanyState.getStateName) == 'TN') {
                return {
                    cgst: (taxable.return * 9) / 100,
                    sgst: (taxable.return * 9) / 100,
                    igst: 0
                }
            }
            else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'TN') {
                return {
                    cgst: 0,
                    sgst: 0,
                    igst: (taxable.return * 18) / 100
                }
            }
        }
      }
    }

    getCabinClass() {
        let type = this.store.selectSnapshot(SearchState.getSearchType);
        switch(type) {
            case "one-way" : return this.store.selectSnapshot(OneWaySearchState.getTripClass);
            case "round-trip" : return this.store.selectSnapshot(RoundTripSearchState.getTripClass);
            case "muti-city" : return this.store.selectSnapshot(MultiCitySearchState.getTripClass);
        }
    }

    getTaxable(plb : plb,basefare : number, yq : number) : number {
        if(plb) {
            let includefare = _.includes(plb.formula,'B&YQ') ? basefare + yq : basefare;
            return includefare ? _.ceil(.05 * basefare, 2) : 0;
        }
        else {
            return 0;
        }
    }

    serviceCharges(): number {

        let serviceCharge: number = 0;

        let type = this.store.selectSnapshot(SearchState.getSearchType);
        let adult = (type) => {
            switch(type) {
            case "one-way" : return this.store.selectSnapshot(OneWaySearchState.getAdult);
            case "round-trip" : return this.store.selectSnapshot(RoundTripSearchState.getAdult);
            case "multi-city" : return this.store.selectSnapshot(MultiCitySearchState.getAdult);
            }
        }

        if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic') {
            console.log(this.store.selectSnapshot(CompanyState.getDomesticServiceCharge),adult(type));
            serviceCharge = this.store.selectSnapshot(CompanyState.getDomesticServiceCharge) * adult(type);
        }
        else if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international') {
            console.log(this.store.selectSnapshot(CompanyState.getInternationalServiceCharge),adult(type));
            serviceCharge = this.store.selectSnapshot(CompanyState.getInternationalServiceCharge) * adult(type);
        }
        return serviceCharge;
    }

    getTripType() : string {
      let searchType : string = this.store.selectSnapshot(SearchState.getSearchType);
      switch(searchType) {
        case "one-way" : return this.store.selectSnapshot(OneWaySearchState.getTripType);
        case "round-trip" : return this.store.selectSnapshot(RoundTripSearchState.getTripType);
        case "one-way" : return this.store.selectSnapshot(MultiCitySearchState.getTripType);
      }
    }

}
