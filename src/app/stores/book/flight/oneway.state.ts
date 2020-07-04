import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, FLightBookState, sendRequest, SetFirstPassengers, kioskRequest, value } from '../flight.state';
import { flightResult, flightData } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { Navigate } from '@ngxs/router-plugin';
import { FlightService } from 'src/app/services/flight/flight.service';
import { OneWayResultState } from '../../result/flight/oneway.state';
import { OneWaySearch, OneWaySearchState } from '../../search/flight/oneway.state';
import { SearchState } from '../../search.state';
import { city } from '../../shared.state';
import { CompanyState } from '../../company.state';
import { environment } from 'src/environments/environment';
import { UserState } from '../../user.state';
import * as moment from 'moment';
import { BookMode, BookType } from '../../book.state';


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

export class GetFareQuoteSSR {
    static readonly type = "[OneWay] GetFareQuoteSSR";

}

export class OneWaySendRequest {
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

export class OneWayBookState{

    constructor(
        public store: Store,
        private flightService : FlightService
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

    @Action(GetFareQuoteSSR)
    async getFareQuoteSSR(states: StateContext<onewayBook>) {

        try {
            const fairQuoteResponse = await this.flightService.fairQuote(this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule);
            if (fairQuoteResponse.status == 200) {
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
            if (SSRResponse.status == 200) {
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
            flight: this.onewaybookData(states.getState().fareQuote)
        });

        this.store.dispatch(new SetFirstPassengers(this.store.selectSnapshot(SearchState.getSearchType)));
        this.store.dispatch(new BookMode('flight'));
        this.store.dispatch(new BookType('one-way'));
        this.store.dispatch(new Navigate(['/', 'home', 'book', 'flight', 'one-way']));

    }

    @Action(OneWaySendRequest)
    async onewaySendRequest(states: StateContext<onewayBook>) {
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
                    flight: data.Fare.PublishedFare - (data.FareBreakdown[0].TaxBreakUp[0].value - data.Fare.OtherCharges),
                    k3: data.Fare.TaxBreakup[0].value,
                    other: data.Fare.OtherCharges,
                    extraMeals: null,
                    extraBaggage: null,
                    total: (
                        data.Fare.PublishedFare - (data.FareBreakdown[0].TaxBreakUp[0].value - data.Fare.OtherCharges) +
                        (this.markupCharges() * data.Fare.PublishedFare) +
                        data.Fare.TaxBreakup[0].value +
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
        if (this.store.selectSnapshot(CompanyState.getStateName) == 'Tamil Nadu') {
            return {
                cgst: (this.serviceCharges() * 9) / 100,
                sgst: (this.serviceCharges() * 9) / 100,
                igst: 0
            }
        }
        else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'Tamil Nadu') {
            return {
                cgst: 0,
                sgst: 0,
                igst: (this.serviceCharges() * 18) / 100
            }
        }
    }

    markupCharges(): number {
        let markupCharge: number = 0;
        if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic') {
            markupCharge = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge) / 100;
            console.log(markupCharge);
        }
        else if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international') {
            markupCharge = this.store.selectSnapshot(CompanyState.getInternationalMarkupCharge) / 100;
            console.log(markupCharge);
        }
        return parseInt(markupCharge.toFixed(2));
    }
}
