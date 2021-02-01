import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, FLightBookState, sendRequest, kioskRequest, value, SetFare, SetMeal, SetBaggage, bookpayload, ticketpayload } from '../flight.state';
import { flightResult, flightData, metrixBoard } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { Navigate } from '@ngxs/router-plugin';
import { FlightService } from 'src/app/services/flight/flight.service';
import { OneWayResultState } from '../../result/flight/oneway.state';
import { OneWaySearch, OneWaySearchState } from '../../search/flight/oneway.state';
import { SearchState } from '../../search.state';
import { city } from '../../shared.state';
import { CompanyState, GetCompany } from '../../company.state';
import { environment } from 'src/environments/environment';
import { UserState } from '../../user.state';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BookMode, BookType, BookState } from '../../book.state';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { StateReset } from 'ngxs-reset-plugin';
import { ResultState } from '../../result.state';
import { FlightPassengerState, SetFirstPassengers } from '../../passenger/flight.passenger.states';
import { empty, from, of } from "rxjs";
import { catchError, concatMap, delay, flatMap, map, tap } from "rxjs/operators";
import { HTTPResponse } from "@ionic-native/http/ngx";
import { ApprovalService } from "src/app/services/approval/approval.service";
import { AgencyState } from "../../agency.state";


export interface onewayBook {
    fareQuote: flightResult,
    ssr: SSR,
    isPriceChanged: boolean,
    flight: bookObj
}

export interface GST {
    cgst: number,
    sgst: number,
    igst: number
}

export interface confirmRequest {
    cc: string[]
    purpose: string,
    comment: string
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

export class GetFareQuoteSSR {
    static readonly type = "[OneWay] GetFareQuoteSSR";

}

export class FlightOneWaySendRequest {
    static readonly type = "[OneWay] FlightOneWaySendRequest";
    constructor(public comment: string, public mailCC: string[], public purpose: string) {

    }
}

export class MealBaggage {
    static readonly type = "[OneWay] MealBaggage";
    constructor(public meal: number, public baggage: number) {

    }
}

export class BookOneWayTicket {
    static readonly type = "[OneWay] BookOneWayTicket";
}


@State<onewayBook>({
    name: 'oneway_book',
    defaults: {
        fareQuote: null,
        isPriceChanged : null,
        ssr: null,
        flight: {
            summary: null,
            trip: []
        }
    }
})

export class OneWayBookState{

    constructor(
        public store: Store,
        private flightService: FlightService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl:ModalController,
        public approvalService : ApprovalService
    ) {
    }

    @Selector()
    static getPassengerFare(states: onewayBook) {
        return states.fareQuote.Fare;
    }

    @Selector()
    static getFlightDetail(states: onewayBook): bookObj {
        return states.flight;
    }

    @Selector()
    static getFareQuote(states: onewayBook) {
        return states.fareQuote;
    }

    @Action(GetFareQuoteSSR)
    getFareQuoteSSR(states: StateContext<onewayBook>) {

        let loading$ = from(this.loadingCtrl.create({
            spinner: "crescent",
            message : "Checking Flight Availability",
            id : 'book-load'
        })).pipe(
            flatMap(
                (loadingEl) => {
                    return from(loadingEl.present());
                }
            )
        );
        const failedAlert$ = (msg : string) => from(this.alertCtrl.create({
            header: 'Book Failed',
            id : 'ssrfailed',
            message : msg,
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    this.alertCtrl.dismiss(null,null,'ssrfailed');
                }
            }]
        })).pipe(
            flatMap(
                (loadingEl) => {
                    return from(loadingEl.present());
                }
            )
        );

        let companyId = this.store.selectSnapshot(UserState.getcompanyId);
        let selectedFlight = this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule;

        let fairQuote$ = from(this.flightService.fairQuote(selectedFlight));
        let ssr$ = from(this.flightService.SSR(selectedFlight));

        return loading$
            .pipe(
                tap(() => states.dispatch(new GetCompany(companyId))),
                concatMap(() => fairQuote$),
                flatMap(
                    (fairQuoteResponse) => {
                        console.log(fairQuoteResponse);
                        if (fairQuoteResponse.status == 200) {
                            let response = JSON.parse(fairQuoteResponse.data).response;
                            if (response.Results) {
                                states.patchState({
                                    fareQuote: response.Results,
                                    isPriceChanged: response.IsPriceChanged,
                                    flight: this.onewaybookData(response.Results)
                                });
                            }
                            else if (response.Error.ErrorCode == 6) {
                                console.log(response.Error.ErrorMessage);
                                this.loadingCtrl.dismiss(null,null,'book-load');
                                this.store.dispatch(new OneWaySearch());
                                return;
                            }
                            else if (response.Error.ErrorCode == 2) {
                                console.log(response.Error.ErrorMessage);
                                this.loadingCtrl.dismiss(null,null,'book-load');
                                return failedAlert$(response.Error.ErrorMessage);
                            }
                        }
                        return of(fairQuoteResponse);
                    }
                ),
                delay(1000),
                flatMap(() => ssr$),
                flatMap(
                    (ssrReponse) => {
                        console.log(ssrReponse);
                        if (ssrReponse.status == 200) {
                            let response : SSR = JSON.parse(ssrReponse.data).response;
                            states.patchState({
                                ssr : response
                            });
                            if (response.MealDynamic) {
                                this.store.dispatch(new SetMeal(response.MealDynamic, null));
                            }
                            else if (response.Meal) {
                                this.store.dispatch(new SetMeal(response.Meal, null));
                            }
            
                            if (response.Baggage) {
                                this.store.dispatch(new SetBaggage(response.Baggage, null));
                            }
                            return of(ssrReponse);
                        }
                        return of(ssrReponse);
                    }
                ),
                flatMap(
                    (response : HTTPResponse) => {
                        if(response.status == 200) {
                            states.dispatch([
                                new SetFare(states.getState().fareQuote.Fare),
                                new SetFirstPassengers(),
                                new BookMode('flight'),
                                new BookType('one-way'),
                                new Navigate(['/', 'home', 'book', 'flight', 'one-way'])
                            ])
                        }
                        return from(this.loadingCtrl.dismiss(null,null,'book-load'));
                    }
                ),
                catchError(
                    (error) => {
                        console.log(error);
                        return from(this.loadingCtrl.dismiss(null,null,'book-load'))
                            .pipe(
                                flatMap(() => failedAlert$(error.error))
                            );
                    }
                )
            )
    }

    @Action(FlightOneWaySendRequest)
    async onewaySendRequest(states: StateContext<onewayBook>, action: FlightOneWaySendRequest) {

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        
        const failedAlert = await this.alertCtrl.create({
            header: 'Send Request Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    failedAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                }
            }]
        });

        const successAlert = await this.alertCtrl.create({
            header: 'Send Request Success',
            subHeader: 'Request status will be updated in My Bookings',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    states.dispatch(new Navigate(['/','home','dashboard','home-tab']));
                    successAlert.dismiss({
                        data: false,
                        role: 'success'
                    });
                    states.dispatch(new StateReset(SearchState,ResultState,BookState));
                    this.modalCtrl.dismiss(null, null, 'book-confirm');
                }
            }]
        });

        loading.message = "Request Sending";
        loading.present();

        let sendReq: sendRequest = null;

        let fromCity: city = this.store.selectSnapshot(OneWaySearchState.getFromValue);
        let toCity: city = this.store.selectSnapshot(OneWaySearchState.getToValue);
        let fromValue: value = {
            airportCode: fromCity.airport_code,
            airportName: fromCity.airport_name,
            cityName: fromCity.city_name,
            cityCode: fromCity.city_code,
            countryCode: fromCity.country_code,
            countryName: fromCity.country_name,
            currency: fromCity.currency,
            nationalty: fromCity.nationalty,
            option_label: fromCity.city_name + "(" + fromCity.city_code + ")," + fromCity.country_code
        }
        let toValue: value = {
            airportCode: toCity.airport_code,
            airportName: toCity.airport_name,
            cityName: toCity.city_name,
            cityCode: toCity.city_code,
            countryCode: toCity.country_code,
            countryName: toCity.country_name,
            currency: toCity.currency,
            nationalty: toCity.nationalty,
            option_label: toCity.city_name + "(" + toCity.city_code + ")," + toCity.country_code
        }

        let kioskRequest: kioskRequest = {
            trip_mode: 1,
            fromValue: fromValue,
            toValue: toValue,
            onwardDate: this.store.selectSnapshot(OneWaySearchState.getTravelDate),
            returnDate: 0,
            adultsType: this.store.selectSnapshot(OneWaySearchState.getAdult),
            childsType: 0,
            infantsType: 0,
            countryFlag: this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? 0 :
                this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international' ? 1 : 0,
            tour: "1",
            client : null
        }

        let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
        let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
        let userId: number = this.store.selectSnapshot(UserState.getUserId);
        let vendorId: number = environment.vendorID;

        let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
        let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();
        let mailcc = approveStatus ? action.mailCC : null;

        sendReq = {
            passenger_details: {
                kioskRequest: kioskRequest,
                passenger: this.store.selectSnapshot(FlightPassengerState.getSelectedPassengers),
                fareQuoteResults : [states.getState().fareQuote],
                flight_details: [states.getState().fareQuote],
                country_flag: this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? "0" : "1",
                user_eligibility: {
                    approverid: "airline",
                    msg: null,
                    company_type: "corporate"
                },
                published_fare: states.getState().fareQuote.Fare.PublishedFare + 
                this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                uapi_params: {
                    selected_plb_Value: {
                        K3: states.getState().flight.summary.total.k3,
                        PLB_earned: states.getState().fareQuote.Fare.PLBEarned,
                        queuenumber: 0,
                        PCC: 0,
                        consolidator_name: 'ONLINE FARE',
                        vendor_id:environment.vendorID
                        
                    },
                    selected_Return_plb_Value:""
                },
                fare_response: {
                    published_fare: states.getState().fareQuote.Fare.PublishedFare + 
                    this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                    cancellation_risk: this.store.selectSnapshot(FLightBookState.getRisk),
                    charges_details: {
                        GST_total: 0,
                        agency_markup: 0,
                        cgst_Charges: this.GST().cgst,
                        sgst_Charges: this.GST().sgst,
                        igst_Charges: this.GST().igst,
                        service_charges: this.serviceCharges(),
                        total_amount: (
                            states.getState().fareQuote.Fare.PublishedFare + 
                            this.markupCharges(states.getState().fareQuote.Fare.PublishedFare) +
                            states.getState().fareQuote.Fare.OtherCharges +
                            this.serviceCharges() +
                            this.GST().sgst +
                            this.GST().cgst +
                            this.GST().igst),
                        cgst_onward: 0,
                        sgst_onward: 0,
                        igst_onward: 0,
                        sgst_return: 0,
                        cgst_return: 0,
                        igst_return: 0,
                        taxable_fare : 0,
                        onward_markup: this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                        return_markup: 0,
                        markup_charges: this.markupPercentage(),
                        other_taxes: 0,
                        vendor: {
                            service_charges: this.serviceCharges(),
                            GST: this.GST().cgst + this.GST().sgst,
                            CGST : 0,
                            SGST : 0,
                            IGST : this.GST().cgst + this.GST().sgst
                        }
                    },
                    onwardfare: [[{
                        FareBasisCode: states.getState().fareQuote.FareRules[0].FareBasisCode,
                        IsPriceChanged: states.getState().isPriceChanged,
                        PassengerCount: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                        PassengerType: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                        basefare: states.getState().fareQuote.FareBreakdown[0].BaseFare,
                        details: {
                            AdditionalTxnFeeOfrd: 0,
                            AdditionalTxnFeePub: 0,
                            BaseFare: states.getState().fareQuote.FareBreakdown[0].BaseFare,
                            PassengerCount: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                            PassengerType: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                            Tax: states.getState().fareQuote.Fare.Tax,
                            TransactionFee: 0,
                            YQTax: states.getState().fareQuote.Fare.TaxBreakup[1].value
                        },
                        tax: states.getState().fareQuote.Fare.Tax,
                        total_amount: states.getState().fareQuote.Fare.PublishedFare,
                        yqtax: states.getState().fareQuote.Fare.TaxBreakup[1].value
                    }]]
                } 
            },
            managers :manager,
            approval_mail_cc: mailcc,
            purpose: action.purpose,
            comments: '[\"' + action.comment + '\"]',
            booking_mode : "online",
            status : "pending",
            trip_type : "business",
            transaction_id : null,
            customer_id: companyId,
            travel_date: this.store.selectSnapshot(OneWaySearchState.getPayloadTravelDate),
            traveller_id: travellersId,
            user_id: userId,
            vendor_id: vendorId,
            trip_requests : this.store.selectSnapshot(OneWaySearchState.getTripRequest)
        }

        console.log(JSON.stringify(sendReq));

        try {
            const sendReqResponse = await this.flightService.sendRequest(sendReq);
            console.log(sendReqResponse);
            console.log(JSON.parse(sendReqResponse.data));
            if (sendReqResponse.status == 200) {
                successAlert.present();
            }
        }
        catch (error) {
            console.log(error);
            let err = JSON.parse(error.error);
            console.log(err);
        }
        loading.dismiss();
    }

    @Action(MealBaggage)
    setMealBaggage(states: StateContext<onewayBook>, action: MealBaggage) {
        let currentstate = Object.assign({},states.getState().flight);
        currentstate.summary.total.extraBaggage = action.baggage;
        currentstate.summary.total.extraMeals = action.meal;

        states.patchState({
            flight : currentstate
        });
    }

    @Action(BookOneWayTicket)
    bookOneWayTicket(states: StateContext<onewayBook>, action: BookOneWayTicket) {

        console.log(action);
        let loading$ = from(this.loadingCtrl.create({
            spinner: "crescent",
            message : "Booking Ticket...",
            id : 'loading-book'
        })).pipe(flatMap((el) => from(el.present())));
        
        let failedAlert = from(this.alertCtrl.create({
            header: 'Booking Failed',
            id : 'failed-book',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    this.alertCtrl.dismiss(null,null,'failed-book');
                }
            }]
        })).pipe(flatMap((el) => from(el.present())));

        let successAlert = from(this.alertCtrl.create({
            header: 'Booking Success',
            subHeader: 'your ticket is booked successfully',
            id : 'success-book',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    this.modalCtrl.dismiss(null, null, 'success-book');
                    states.dispatch(new Navigate(['/','home','dashboard','home-tab']));
                    states.dispatch(new StateReset(SearchState,ResultState,BookState));
                }
            }]
        })).pipe(flatMap((el) => from(el.present())));

        let fairIndex = this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule;
        let sendReq: sendRequest = null;

        let fromCity: city = this.store.selectSnapshot(OneWaySearchState.getFromValue);
        let toCity: city = this.store.selectSnapshot(OneWaySearchState.getToValue);
        let fromValue: value = {
            airportCode: fromCity.airport_code,
            airportName: fromCity.airport_name,
            cityName: fromCity.city_name,
            cityCode: fromCity.city_code,
            countryCode: fromCity.country_code,
            countryName: fromCity.country_name,
            currency: fromCity.currency,
            nationalty: fromCity.nationalty,
            option_label: fromCity.city_name + "(" + fromCity.city_code + ")," + fromCity.country_code,
            client : null
        }
        let toValue: value = {
            airportCode: toCity.airport_code,
            airportName: toCity.airport_name,
            cityName: toCity.city_name,
            cityCode: toCity.city_code,
            countryCode: toCity.country_code,
            countryName: toCity.country_name,
            currency: toCity.currency,
            nationalty: toCity.nationalty,
            option_label: toCity.city_name + "(" + toCity.city_code + ")," + toCity.country_code
        }

        let kioskRequest: kioskRequest = {
            trip_mode: 1,
            fromValue: fromValue,
            toValue: toValue,
            onwardDate: this.store.selectSnapshot(OneWaySearchState.getTravelDate),
            returnDate: 0,
            adultsType: this.store.selectSnapshot(OneWaySearchState.getAdult),
            childsType: 0,
            infantsType: 0,
            countryFlag: this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? 0 :
                this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international' ? 1 : 0,
            tour: "1",
            travelType: 0,
            travelType2: 0,
            client : null
        }

        let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
        let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
        let userId: number = this.store.selectSnapshot(UserState.getUserId);
        let vendorId: number = environment.vendorID;

        let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
        let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();
        let mailcc = null;

        sendReq = {
            passenger_details: {
                kioskRequest: kioskRequest,
                passenger: this.store.selectSnapshot(FlightPassengerState.getSelectedPassengers),
                flight_details: [states.getState().fareQuote],
                country_flag: this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? "0" : "1",
                user_eligibility: {
                    msg: null,
                    company_type: "corporate"
                },
                published_fare: states.getState().fareQuote.Fare.PublishedFare + 
                this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                uapi_params: {
                    selected_plb_Value: {
                        K3: states.getState().flight.summary.total.k3,
                        PLB_earned: states.getState().fareQuote.Fare.PLBEarned,
                        queuenumber: 0,
                        PCC: 0,
                        consolidator_name: 'ONLINE FARE',
                        vendor_id:environment.vendorID
                        
                    },
                    selected_Return_plb_Value:""
                },
                fare_response: {
                    published_fare: states.getState().fareQuote.Fare.PublishedFare + 
                    this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                    cancellation_risk: this.store.selectSnapshot(FLightBookState.getRisk),
                    charges_details: {
                        GST_total: 0,
                        agency_markup: 0,
                        cgst_Charges: this.GST().cgst,
                        sgst_Charges: this.GST().sgst,
                        igst_Charges: this.GST().igst,
                        service_charges: this.serviceCharges(),
                        total_amount: (
                            states.getState().fareQuote.Fare.PublishedFare + 
                            this.markupCharges(states.getState().fareQuote.Fare.PublishedFare) +
                            states.getState().fareQuote.Fare.OtherCharges +
                            this.serviceCharges() +
                            this.GST().sgst +
                            this.GST().cgst +
                            this.GST().igst),
                        cgst_onward: 0,
                        sgst_onward: 0,
                        igst_onward: 0,
                        sgst_return: 0,
                        cgst_return: 0,
                        igst_return: 0,
                        taxable_fare : 0,
                        onward_markup: 0,
                        return_markup: 0,
                        markup_charges: this.markupPercentage(),
                        other_taxes: 0,
                        vendor: {
                            service_charges: this.serviceCharges(),
                            GST: this.GST().cgst + this.GST().sgst,
                            CGST : 0,
                            SGST : 0,
                            IGST : this.GST().cgst + this.GST().sgst
                        }
                    },
                    onwardfare: [[{
                        FareBasisCode: states.getState().fareQuote.FareRules[0].FareBasisCode,
                        IsPriceChanged: states.getState().isPriceChanged,
                        PassengerCount: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                        PassengerType: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                        basefare: states.getState().fareQuote.FareBreakdown[0].BaseFare,
                        details: {
                            AdditionalTxnFeeOfrd: 0,
                            AdditionalTxnFeePub: 0,
                            BaseFare: states.getState().fareQuote.FareBreakdown[0].BaseFare,
                            PassengerCount: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                            PassengerType: states.getState().fareQuote.FareBreakdown[0].PassengerCount,
                            Tax: states.getState().fareQuote.Fare.Tax,
                            TransactionFee: 0,
                            YQTax: states.getState().fareQuote.Fare.TaxBreakup[1].value
                        },
                        tax: states.getState().fareQuote.Fare.Tax,
                        total_amount: states.getState().fareQuote.Fare.PublishedFare,
                        yqtax: states.getState().fareQuote.Fare.TaxBreakup[1].value
                    }]]
                } 
            },
            managers :manager,
            comments: null,
            booking_mode : "online",
            status : "open",
            trip_type : "business",
            transaction_id : null,
            customer_id: companyId,
            travel_date: this.store.selectSnapshot(OneWaySearchState.getPayloadTravelDate),
            traveller_id: travellersId,
            user_id: userId,
            vendor_id: vendorId,
            trip_requests : this.store.selectSnapshot(OneWaySearchState.getTripRequest)
        }

        console.log(JSON.stringify(sendReq));
        let plb$ = this.flightService.getPLB();
        let openreq$ = from(this.flightService.sendRequest(sendReq,false));

        return loading$.pipe(
            flatMap(() => plb$),
            flatMap(
                (response) => {

                    console.log(response);
                    let plb : plb[] = JSON.parse(response.data);

                    ///plb json
                    console.log(JSON.stringify(plb));

                    let basefare = states.getState().fareQuote.FareBreakdown[0].BaseFare;
                    let taxbreakup = states.getState().fareQuote.Fare.TaxBreakup[1].value;
                    let taxable = this.getTaxable(plb[0],basefare,taxbreakup);
                    sendReq.passenger_details.fare_response.charges_details.taxable_fare = taxable;

                    return openreq$.pipe(
                        flatMap(
                            (response : HTTPResponse) => {

                                console.log(response);
                                let openreq = JSON.parse(response.data).data;

                                //open req json
                                console.log(JSON.stringify(openreq));

                                let passenger = openreq.passenger_details.passenger;
                                let bkpl : bookpayload = {
                                    Passengers : passenger.map(el => _.pick(el,['AddressLine1','City','CountryName','CountryCode','Email','PaxType','IsLeadPax','FirstName','LastName','ContactNo','DateOfBirth','Title','Gender','Fare'])),
                                    TraceId: fairIndex.TraceId,
                                    JourneyType: openreq.trip_requests.JourneyType,
                                    IsLCC: openreq.passenger_details.flight_details[0].IsLCC,
                                    ResultIndex: fairIndex.ResultIndex
                                }
                                let book$ = from(this.flightService.bookFlight(bkpl));
                                return book$.pipe(
                                    flatMap(
                                        (response) => {
                                            console.log(response);
                                            let bookres = JSON.parse(response.data);

                                            //book res json
                                            console.log(JSON.stringify(bookres));
                        
                                            let metrix : metrixBoard = {
                                                type_of_booking: "airline",
                                                sector: {
                                                  api: "/airlines/book",
                                                  Book_request: bkpl,
                                                  book_response: response,
                                                  request_id: openreq.id,
                                                  fareQuote_onward: this.store.selectSnapshot(OneWayBookState.getFareQuote),
                                                  fareQuote_return: ""
                                                }
                                              }
                        
                                            let bookreq$ = from(this.flightService.metrixboard(metrix));
                                            return bookreq$
                                              .pipe(
                                                flatMap(
                                                    (response) => {
                                                        let data = JSON.parse(response.data);
                                                        console.log(data,response);

                                                        //metrix json
                                                        console.log(JSON.stringify(data));

                                                        let chargesdetail = {
                                                            GST_total: 0,
                                                            agency_markup: 0,
                                                            cgst_Charges: this.GST().cgst,
                                                            sgst_Charges: this.GST().sgst,
                                                            igst_Charges: this.GST().igst,
                                                            service_charges: this.serviceCharges(),
                                                            total_amount: (
                                                                states.getState().fareQuote.Fare.PublishedFare + 
                                                                this.markupCharges(states.getState().fareQuote.Fare.PublishedFare) +
                                                                states.getState().fareQuote.Fare.OtherCharges +
                                                                this.serviceCharges() +
                                                                this.GST().sgst +
                                                                this.GST().cgst +
                                                                this.GST().igst),
                                                            cgst_onward: 0,
                                                            sgst_onward: 0,
                                                            igst_onward: 0,
                                                            sgst_return: 0,
                                                            cgst_return: 0,
                                                            igst_return: 0,
                                                            onward_markup: 0,
                                                            return_markup: 0,
                                                            markup_charges: 0,
                                                            taxable_fare : taxable,
                                                            TDS_Rate : this.store.selectSnapshot(AgencyState.getAgency).gst_details.TDS_Rate.find(el => !el.expired && moment({}).isBetween(el.start_dt,el.end_dt,'d','[]')).rate,
                                                            other_taxes: 0,
                                                            vendor: {
                                                                service_charges: 0,
                                                                GST: 0
                                                            }
                                                        }

                                                        let pnr = JSON.stringify([bookres.response.Response.PNR.toString()])
                                                        let bookingid = JSON.stringify([bookres.response.Response.BookingId.toString()]);
                                                        console.log(pnr,bookingid);

                                                        let approveObj = {
                                                            passenger_details: {
                                                              BookingDate: moment({}).format("DD-MM-YYYY hh:mm:A"),
                                                              vendor: "TBO",
                                                              onwardDuration: "01h:45m",
                                                              PNR: pnr,
                                                              BookingId:bookingid ,
                                                              ticket_details: [
                                                                {
                                                                  data: [bookres]
                                                                }
                                                              ],
                                                              uapi_params: {
                                                                selected_plb_Value: {
                                                                    K3: states.getState().flight.summary.total.k3,
                                                                    PLB_earned: states.getState().fareQuote.Fare.PLBEarned,
                                                                    queuenumber: 0,
                                                                    PCC: 0,
                                                                    consolidator_name: 'ONLINE FARE',
                                                                    vendor_id:environment.vendorID
                                                                    
                                                                },
                                                                selected_Return_plb_Value:""
                                                            },
                                                              passenger: this.store.selectSnapshot(FlightPassengerState.getSelectedPassengers),
                                                              fare_response: {
                                                                published_fare: states.getState().fareQuote.Fare.PublishedFare + 
                                                                this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                                                                charges_details: chargesdetail,
                                                                cancellation_risk: this.store.selectSnapshot(FLightBookState.getRisk)
                                                              },
                                                              flight_details: [states.getState().fareQuote],
                                                              country_flag: this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? 0 :
                                                              this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international' ? 1 : 0,
                                                              trace_Id: fairIndex.TraceId,
                                                              published_fare: states.getState().fareQuote.Fare.PublishedFare + 
                                                              this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                                                              user_eligibility: {
                                                                approverid: "airline",
                                                                msg: null,
                                                                company_type: "corporate"
                                                            }
                                                            },
                                                            booking_mode: "online",
                                                            traveller_id: travellersId,
                                                            travel_date: openreq.travel_date,
                                                            comments: null,
                                                            trip_requests:  this.store.selectSnapshot(OneWaySearchState.getTripRequest),
                                                            cancellation_remarks: null,
                                                            trip_type: "business",
                                                            customer_id: companyId,
                                                            transaction_id: null,
                                                            managers: manager,
                                                            user_id: data.user_id,
                                                            req_id: openreq.id,
                                                            vendor_id: vendorId,
                                                            purpose: null,
                                                            status: "booked"
                                                        }
                                                        console.log(approveObj);
            
                                                        let bookreq$ = this.approvalService.approvalReq('flight',openreq.id,approveObj);
                                                        return bookreq$
                                                    }
                                                ),
                                                flatMap(
                                                    (resp : HTTPResponse) => {
                                                        console.log(resp);
                                                        let data = JSON.parse(resp.data).data;
                                                        console.log(data);

                                                        //metrix json
                                                        console.log(JSON.stringify(data));

                                                        let ticket : ticketpayload = {
                                                            user_id: data.traveller_id,
                                                            airline_request_id: data.req_id,
                                                            pnr: data.passenger_details.PNR,
                                                            booking_id: data.passenger_details.BookingId,
                                                            booking_status: "Booked",
                                                            published_fare: data.passenger_details.fare_response.published_fare,
                                                            offered_fare: data.passenger_details.fare_response.published_fare,
                                                            collected_fare: 0,
                                                            ticket_status: "Booked",
                                                            email_notify: true
                                                        };
                                                        return this.flightService.bookTicket(ticket);
                                                    }
                                                ),
                                                flatMap(
                                                    (response) => {
                                                        console.log(response);

                                                        
                                                        let data = JSON.parse(response.data).data;
                                                        console.log(data);
                                                        //book ticket json
                                                        console.log(JSON.stringify(data));
                                                        
                                                        this.loadingCtrl.dismiss(null,null,'loading-book');
                                                        if(response.status == 200) {
                                                            return successAlert;
                                                        }
                                                        else {
                                                            return failedAlert;
                                                        }
                                                    }
                                                )
                                              );
                                        }
                                    )
                                );
                            }
                        )
                    );
                }
            ),
            catchError(
                (error) => {
                    this.loadingCtrl.dismiss(null,null,'loading-book');
                    console.log(error);
                    return failedAlert;
                }
            )
        );


    }

    onewaybookData(data: flightResult): bookObj {

        let book: bookObj = {
            summary: {
                fare: {
                    base: data.Fare.BaseFare,
                    taxes: data.Fare.Tax 
                },
                total: {
                    serviceCharge: this.serviceCharges(),
                    SGST: this.GST().sgst,
                    CGST: this.GST().cgst,
                    IGST: this.GST().igst,
                    flight: (data.Fare.PublishedFare - data.Fare.TaxBreakup[0].value) + this.markupCharges(data.Fare.PublishedFare),
                    k3: data.Fare.TaxBreakup[0].value,
                    other: data.Fare.OtherCharges,
                    extraMeals: 0,
                    extraBaggage: 0,
                    total: (
                        data.Fare.PublishedFare + 
                        this.markupCharges(data.Fare.PublishedFare) +
                        data.Fare.OtherCharges +
                        this.serviceCharges() +
                        this.GST().sgst +
                        this.GST().cgst +
                        this.GST().igst),
                    currency: data.FareBreakdown[0].Currency
                }

            },
            trip: []
        };

        data.Segments.forEach(
            (element: flightData[], index: number) => {
                book.trip[index] = {
                    origin: element[0].Origin.Airport.CityName,
                    destination: element[element.length - 1].Destination.Airport.CityName,
                    connecting_flight: []
                }

                element.forEach(
                    (el: flightData, ind: number) => {

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
                                terminal: el.Origin.Airport.Terminal
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

        console.log(book);
        return book;
    }

    serviceCharges(): number {
        let serviceCharge: number = 0;
        if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getDomesticServiceCharge) * this.store.selectSnapshot(OneWaySearchState.getAdult);
        }
        else if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getInternationalServiceCharge) * this.store.selectSnapshot(OneWaySearchState.getAdult);
        }
        return serviceCharge;
    }

    GST(): GST {
        if (this.store.selectSnapshot(CompanyState.getStateName) == 'TN') {
            return {
                cgst: (this.serviceCharges() * 9) / 100,
                sgst: (this.serviceCharges() * 9) / 100,
                igst: 0
            }
        }
        else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'TN') {
            return {
                cgst: 0,
                sgst: 0,
                igst: (this.serviceCharges() * 18) / 100
            }
        }
    }

    markupCharges(fare : number): number {
        let domesticmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);
        let intmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);

        if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic') {
            if(domesticmarkup !== 0){
                return (fare / 100) * domesticmarkup;
            }
            else {
                return 0;
            }
        }
        else if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international') {
            if(intmarkup !== 0){
                return (fare / 100) * intmarkup;
            }
            else {
                return 0;
            }
        }
    }

    markupPercentage() {
        let domesticmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);
        let intmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);

        if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic') {
            if(domesticmarkup !== 0){
                return domesticmarkup / 100;
            }
            else {
                return 0;
            }
        }
        else if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international') {
            if(intmarkup !== 0){
                return intmarkup / 100;
            }
            else {
                return 0;
            }
        }
    }

    bookingPerson() {
        let users = this.store.selectSnapshot(CompanyState.getEmployees);
        let admins = users.filter(user => user.role == 'admin' && user.is_rightsto_book !== null && user.is_rightsto_book);
        return [admins[0].email];
    }

    getTaxable(plb : plb,basefare : number, yq : number) : number {
        let includefare = _.includes(plb.formula,'B&YQ') ? basefare + yq : basefare;
        return includefare ? _.ceil(.05 * basefare, 2) : 0;
    }
}