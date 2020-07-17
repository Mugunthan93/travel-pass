import { Selector, Action, State, Store, StateContext } from '@ngxs/store';
import { flightResult, flightData } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { bookObj, value, FLightBookState, rt_uapi_params, rt_sendRequest, SetFirstPassengers, rt_kioskRequest } from '../flight.state';
import { FlightService } from 'src/app/services/flight/flight.service';
import { DomesticResultState } from '../../result/flight/domestic.state';
import { RoundTripSearch, RoundTripSearchState } from '../../search/flight/round-trip.state';
import * as moment from 'moment';
import { CompanyState } from '../../company.state';
import { GST } from './oneway.state';
import { city } from '../../shared.state';
import { UserState } from '../../user.state';
import { environment } from 'src/environments/environment';
import { Navigate } from '@ngxs/router-plugin';
import { SearchState } from '../../search.state';
import { BookMode, BookType, BookState } from '../../book.state';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { StateReset } from 'ngxs-reset-plugin';
import { ResultState } from '../../result.state';

export interface domesticBook {
    departure: {  
        fareQuote: flightResult,
        ssr: SSR,
        isPriceChanged: boolean,
        flight: bookObj
    },
    return: {
        fareQuote: flightResult,
        ssr: SSR,
        isPriceChanged: boolean,
        flight: bookObj
    }
}

export class GetFareQuoteSSR {
    static readonly type = "[Domestic] GetFareQuoteSSR";

}

export class DomesticSendRequest {
    static readonly type = "[Domestic] DomesticSendRequest";
    constructor() {

    }
}


@State<domesticBook>({
    name: 'domestic_book',
    defaults: {
        departure: {
            fareQuote: null,
            isPriceChanged: null,
            ssr: null,
            flight: {
                summary: null,
                trip: []
            }
        },
        return: {
            fareQuote: null,
            isPriceChanged: null,
            ssr: null,
            flight: {
                summary: null,
                trip: []
            }
        }
    }
})

export class DomesticBookState {

    constructor(
        public store: Store,
        private flightService: FlightService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl:ModalController
    ) {
    }

    @Selector()
    static getDeparturePassengerFare(states: domesticBook) {
        return states.departure.fareQuote.Fare;
    }

    @Selector()
    static getReturnPassengerFare(states: domesticBook) {
        return states.return.fareQuote.Fare;
    }

    @Selector()
    static getDepartureFlightDetail(states: domesticBook): bookObj {
        return states.departure.flight;
    }

    @Selector()
    static getReturnFlightDetail(states: domesticBook): bookObj {
        return states.return.flight;
    }

    @Action(GetFareQuoteSSR)
    async getFareQuoteSSR(states: StateContext<domesticBook>) {

        let depFQ = null;
        let depPriceChange = false;
        let depSSR = null;
        let reFQ = null;
        let rePriceChange = false;
        let reSSR = null;

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Book Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    failedAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                }
            }]
        });

        loading.message = "Checking Flight Availability";
        loading.present();

        try {
            const departureFQResponse = await this.flightService.fairQuote(this.store.selectSnapshot(DomesticResultState.getSelectedDepartureFlight).fareRule);
            const returnFQResponse = await this.flightService.fairQuote(this.store.selectSnapshot(DomesticResultState.getSelectedReturnFlight).fareRule);
            console.log(departureFQResponse, returnFQResponse);
            if (departureFQResponse.status == 200 && returnFQResponse.status == 200) {
                let depResponse = JSON.parse(departureFQResponse.data).response;
                let reResponse = JSON.parse(returnFQResponse.data).response;
                console.log(depResponse, reResponse);
                if (depResponse.Results && reResponse.Results) {
                    depFQ = depResponse.Results;
                    depPriceChange = depResponse.IsPriceChanged;
                    reFQ = reResponse.Results;
                    rePriceChange = reResponse.IsPriceChanged;
                }
                else if (depResponse.Error.ErrorCode == 2 || reResponse.Error.ErrorCode == 2) {
                    console.log(depResponse.Error.ErrorMessage);
                    loading.dismiss();
                    this.store.dispatch(new RoundTripSearch());
                    return;
                }
                else if (depResponse.Error.ErrorCode == 6 || reResponse.Error.ErrorCode == 6) {
                    console.log(depResponse.Error.ErrorMessage);
                    loading.dismiss();
                    this.store.dispatch(new RoundTripSearch());
                    return;
                }
            }
        }
        catch (error) {
            console.log(error);
        }

        try {
            const departureSSRResponse = await this.flightService.SSR(this.store.selectSnapshot(DomesticResultState.getSelectedDepartureFlight).fareRule);
            const returnSSRResponse = await this.flightService.SSR(this.store.selectSnapshot(DomesticResultState.getSelectedReturnFlight).fareRule);
            console.log(departureSSRResponse, returnSSRResponse);
            if (departureSSRResponse.status == 200 && returnSSRResponse.status == 200) {
                depSSR = JSON.parse(departureSSRResponse.data).response;
                reSSR = JSON.parse(returnSSRResponse.data).response;
                console.log(depSSR, reSSR);
            }
        }
        catch (error) {
            console.log(error);
        }

        states.patchState({
            departure: {
                fareQuote: depFQ,
                isPriceChanged: depPriceChange,
                ssr: depSSR,
                flight: this.domesticbookData(depFQ)
            },
            return : {
                fareQuote: reFQ,
                isPriceChanged: rePriceChange,
                ssr: reSSR,
                flight: this.domesticbookData(reFQ)
            }
        });

        this.store.dispatch(new SetFirstPassengers(this.store.selectSnapshot(SearchState.getSearchType)));
        this.store.dispatch(new BookMode('flight'));
        this.store.dispatch(new BookType('animated-round-trip'));
        this.store.dispatch(new Navigate(['/', 'home', 'book', 'flight', 'round-trip','domestic']));
        loading.dismiss();
    }

    @Action(DomesticSendRequest)
    async roundTripSendRequest(states: StateContext<domesticBook>) {

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Send Request Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
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
                handler: (res) => {
                    this.store.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
                    successAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                    this.store.dispatch(new StateReset(SearchState, ResultState, BookState));
                    this.modalCtrl.dismiss(null, null, 'send-request');
                }
            }]
        });

        loading.message = "Request Sending";
        loading.present();

        let sendReq: rt_sendRequest = null;


        let fromCity: city = this.store.selectSnapshot(RoundTripSearchState.getFromValue);
        let toCity: city = this.store.selectSnapshot(RoundTripSearchState.getToValue);
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

        let kioskRequest: rt_kioskRequest = {
            trip_mode: 2,
            fromValue: fromValue,
            toValue: toValue,
            onwardDate: this.store.selectSnapshot(RoundTripSearchState.getTravelDate),
            returnDate: this.store.selectSnapshot(RoundTripSearchState.getReturnDate),
            adultsType: this.store.selectSnapshot(RoundTripSearchState.getAdult),
            childsType: 0,
            infantsType: 0,
            countryFlag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? 0 :
                this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international' ? 1 : 0,
            tour: "1"
        }

        let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
        let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
        let userId: number = this.store.selectSnapshot(UserState.getUserId);
        let vendorId: number = environment.vendorID;
        let uapi_params: rt_uapi_params = {
            selected_plb_Value: {
                K3: states.getState().departure.flight.summary.total.k3,
                PLB_earned: states.getState().departure.fareQuote.Fare.PLBEarned,
                queuenumber: 0,
                PCC: 0,
                consolidator_name: 'ONLINE FARE',
                vendor_id: environment.vendorID

            },
            selected_Return_plb_Value: {
                K3: states.getState().return.flight.summary.total.k3,
                PLB_earned: states.getState().return.fareQuote.Fare.PLBEarned,
                queuenumber: 0,
                PCC: 0,
                consolidator_name: 'ONLINE FARE',
                vendor_id: environment.vendorID
            }
        }

        let published_fare = (
            states.getState().departure.fareQuote.Fare.PublishedFare - (states.getState().departure.fareQuote.FareBreakdown[0].TaxBreakUp[0].value - states.getState().departure.fareQuote.Fare.OtherCharges) +
            (this.markupCharges() * states.getState().departure.fareQuote.Fare.PublishedFare) +
            states.getState().departure.fareQuote.Fare.TaxBreakup[0].value +
            states.getState().departure.fareQuote.Fare.OtherCharges +
            this.serviceCharges() +
            this.GST().sgst +
            this.GST().cgst +
            this.GST().igst) + (
            states.getState().return.fareQuote.Fare.PublishedFare - (states.getState().return.fareQuote.FareBreakdown[0].TaxBreakUp[0].value - states.getState().return.fareQuote.Fare.OtherCharges) +
            (this.markupCharges() * states.getState().return.fareQuote.Fare.PublishedFare) +
            states.getState().return.fareQuote.Fare.TaxBreakup[0].value +
            states.getState().return.fareQuote.Fare.OtherCharges +
                this.serviceCharges() +
                this.GST().sgst +
                this.GST().cgst +
                this.GST().igst)

        sendReq = {
            passenger_details: {
                kioskRequest: kioskRequest,
                passenger: this.store.selectSnapshot(FLightBookState.getSelectedPassengers),
                flight_details: [states.getState().departure.fareQuote, states.getState().return.fareQuote],
                country_flag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? "0" : "1",
                user_eligibility: {
                    approverid: "airline",
                    msg: null,
                    company_type: "corporate"
                },
                published_fare: published_fare,
                uapi_params: uapi_params,
                fare_response: {
                    published_fare: published_fare,
                    cancellation_risk: this.store.selectSnapshot(FLightBookState.getRisk),
                    charges_details: {
                        GST_total: 0,
                        agency_markup: 0,
                        cgst_Charges: this.GST().cgst,
                        sgst_Charges: this.GST().sgst,
                        igst_Charges: this.GST().igst,
                        service_charges: this.serviceCharges(),
                        total_amount: published_fare,
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
                        FareBasisCode: states.getState().departure.fareQuote.FareRules[0].FareBasisCode,
                        IsPriceChanged: states.getState().departure.isPriceChanged,
                        PassengerCount: states.getState().departure.fareQuote.FareBreakdown[0].PassengerCount,
                        PassengerType: states.getState().departure.fareQuote.FareBreakdown[0].PassengerCount,
                        basefare: states.getState().departure.fareQuote.FareBreakdown[0].BaseFare,
                        details: {
                            AdditionalTxnFeeOfrd: 0,
                            AdditionalTxnFeePub: 0,
                            BaseFare: states.getState().departure.fareQuote.FareBreakdown[0].BaseFare,
                            PassengerCount: states.getState().departure.fareQuote.FareBreakdown[0].PassengerCount,
                            PassengerType: states.getState().departure.fareQuote.FareBreakdown[0].PassengerCount,
                            Tax: states.getState().departure.fareQuote.Fare.Tax,
                            TransactionFee: 0,
                            YQTax: states.getState().departure.fareQuote.Fare.TaxBreakup[1].value
                        },
                        tax: states.getState().departure.fareQuote.Fare.Tax,
                        total_amount: states.getState().departure.fareQuote.Fare.PublishedFare,
                        yqtax: states.getState().departure.fareQuote.Fare.TaxBreakup[1].value
                    }]],
                    returnfare: [[{
                        FareBasisCode: states.getState().return.fareQuote.FareRules[0].FareBasisCode,
                        IsPriceChanged: states.getState().return.isPriceChanged,
                        PassengerCount: states.getState().return.fareQuote.FareBreakdown[0].PassengerCount,
                        PassengerType: states.getState().return.fareQuote.FareBreakdown[0].PassengerCount,
                        basefare: states.getState().return.fareQuote.FareBreakdown[0].BaseFare,
                        details: {
                            AdditionalTxnFeeOfrd: 0,
                            AdditionalTxnFeePub: 0,
                            BaseFare: states.getState().return.fareQuote.FareBreakdown[0].BaseFare,
                            PassengerCount: states.getState().return.fareQuote.FareBreakdown[0].PassengerCount,
                            PassengerType: states.getState().return.fareQuote.FareBreakdown[0].PassengerCount,
                            Tax: states.getState().return.fareQuote.Fare.Tax,
                            TransactionFee: 0,
                            YQTax: states.getState().return.fareQuote.Fare.TaxBreakup[1].value
                        },
                        tax: states.getState().return.fareQuote.Fare.Tax,
                        total_amount: states.getState().return.fareQuote.Fare.PublishedFare,
                        yqtax: states.getState().return.fareQuote.Fare.TaxBreakup[1].value
                    }]]
                }
            },
            managers: this.store.selectSnapshot(UserState.getApprover),
            approval_mail_cc: this.store.selectSnapshot(FLightBookState.getCC),
            purpose: this.store.selectSnapshot(FLightBookState.getPurpose),
            comments: '[\"' + this.store.selectSnapshot(FLightBookState.getComment) + '\"]',

            booking_mode: "online",
            status: "pending",
            trip_type: "business",
            transaction_id: null,
            customer_id: companyId,
            travel_date: this.store.selectSnapshot(RoundTripSearchState.getPayloadTravelDate),
            traveller_id: travellersId,
            user_id: userId,
            vendor_id: vendorId,
            trip_requests: this.store.selectSnapshot(RoundTripSearchState.getTripRequest)
        }

        try {
            const sendReqResponse = await this.flightService.rtSendRequest(sendReq);
            console.log(sendReqResponse);
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

    domesticbookData(data: flightResult): bookObj {

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
        if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getDomesticServiceCharge) * this.store.selectSnapshot(RoundTripSearchState.getAdult);
        }
        else if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getInternationalServiceCharge) * this.store.selectSnapshot(RoundTripSearchState.getAdult);
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
        if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic') {
            markupCharge = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge) / 100;
            console.log(markupCharge);
        }
        else if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international') {
            markupCharge = this.store.selectSnapshot(CompanyState.getInternationalMarkupCharge) / 100;
            console.log(markupCharge);
        }
        return parseInt(markupCharge.toFixed(2));
    }
}