import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, FLightBookState, sendRequest, SetFirstPassengers, kioskRequest, value } from '../flight.state';
import { flightResult } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { Navigate } from '@ngxs/router-plugin';
import { FlightService } from 'src/app/services/flight/flight.service';
import { OneWayResultState } from '../../result/flight/oneway.state';
import { BaseFlightBook } from './flight-book';
import { OneWaySearch, OneWaySearchState } from '../../search/flight/oneway.state';
import { SearchState } from '../../search.state';
import { city } from '../../shared.state';
import { CompanyState } from '../../company.state';
import { environment } from 'src/environments/environment';
import { UserState } from '../../user.state';
import * as moment from 'moment';


export interface onewayBook {
    fareQuote: flightResult,
    ssr: SSR,
    isPriceChanged: boolean,
    flight: bookObj
}

export interface confirmRequest {
    cc: string[]
    purpose: string,
    comment: string
}

export class BookTicket {
    static readonly type = "[OneWay] BookTicket";

}

export class SendRequest {
    static readonly type = "[OneWay] SendRequest";
    constructor() {

    }
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

export class OneWayBookState extends BaseFlightBook{

    constructor(
        public store: Store,
        private flightService : FlightService
    ) {
        super(store);
    }

    @Selector()
    static getPassengerFare(states: onewayBook) {
        return states.fareQuote.Fare;
    }

    @Selector()
    static getFlightDetail(states: onewayBook): bookObj {
        return states.flight;
    }

    @Action(BookTicket)
    async bookTicket(states: StateContext<onewayBook>) {

        try {
            const fairQuoteResponse = await this.flightService.fairQuote(this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule);
            if (fairQuoteResponse.status = 200) {
                let response = JSON.parse(fairQuoteResponse.data).response;
                if (response.Results) {
                    states.patchState({
                        fareQuote: response.Results,
                        isPriceChanged: response.IsPriceChanged
                    });

                }
                else if (response.Error.ErrorCode == 6) {
                    console.log(response.Error.ErrorMessage);
                    this.store.dispatch(new OneWaySearch());
                    return;
                }
            }
        }
        catch (error) {
            console.log(error);
        }

        try {
            const SSRResponse = await this.flightService.SSR(this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule);
            if (SSRResponse.status = 200) {
                let response = JSON.parse(SSRResponse.data).response;
                states.patchState({
                    ssr : response
                    });
            }
        }
        catch (error) {
            console.log(error);
        }

        states.patchState({
            flight: this.bookData(states.getState().fareQuote)
        });

        this.store.dispatch(new SetFirstPassengers(this.store.selectSnapshot(SearchState.getSearchType)));
        this.store.dispatch(new Navigate(['/', 'home', 'book', 'flight', 'one-way']));

    }

    @Action(SendRequest)
    async sendRequest(states: StateContext<onewayBook>) {
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
            tour: "1"
        }

        let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
        let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
        let userId: number = this.store.selectSnapshot(UserState.getUserId);
        let vendorId: number = environment.vendorID;

        sendReq = {
            passenger_details: {
                kioskRequest: kioskRequest,
                passenger: this.store.selectSnapshot(FLightBookState.getSelectedPassengers),
                flight_details: [states.getState().fareQuote],
                country_flag: this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? "0" : "1",
                user_eligibility: {
                    msg: null,
                    company_type: "corporate"
                },
                published_fare: states.getState().fareQuote.Fare.PublishedFare,
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
                    published_fare: states.getState().fareQuote.Fare.PublishedFare,
                    cancellation_risk: this.store.selectSnapshot(FLightBookState.getRisk),
                    charges_details: {
                        GST_total: 0,
                        agency_markup: 0,
                        cgst_Charges: this.GST().cgst,
                        sgst_Charges: this.GST().sgst,
                        igst_Charges: this.GST().igst,
                        service_charges: this.serviceCharges(),
                        total_amount: (
                            states.getState().fareQuote.Fare.PublishedFare - (states.getState().fareQuote.FareBreakdown[0].TaxBreakUp[0].value - states.getState().fareQuote.Fare.OtherCharges) +
                            (this.markupCharges() * states.getState().fareQuote.Fare.PublishedFare) +
                            states.getState().fareQuote.Fare.TaxBreakup[0].value +
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
                        other_taxes: 0,
                        vendor: {
                            service_charges: 0,
                            GST: 0
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
            managers : this.store.selectSnapshot(UserState.getApprover),
            approval_mail_cc: this.store.selectSnapshot(FLightBookState.getCC).toString(),
            purpose: this.store.selectSnapshot(FLightBookState.getPurpose),
            comments: '[\"' + this.store.selectSnapshot(FLightBookState.getComment) + '\"]',
        
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
        }
        catch (error) {
            console.log(error);
            let err = JSON.parse(error.error);
            console.log(err);
        }
    }
}
