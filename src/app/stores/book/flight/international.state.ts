import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, FLightBookState, value, rt_kioskRequest, int_sendRequest, SetFare, SetMeal, SetBaggage } from '../flight.state';
import { flightResult, flightData } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { Navigate } from '@ngxs/router-plugin';
import { FlightService } from 'src/app/services/flight/flight.service';
import { SearchState } from '../../search.state';
import { city } from '../../shared.state';
import { CompanyState, GetCompany } from '../../company.state';
import { environment } from 'src/environments/environment';
import { UserState } from '../../user.state';
import * as moment from 'moment';
import { GST } from './oneway.state';
import { InternationalResultState } from '../../result/flight/international.state';
import { RoundTripSearchState, RoundTripSearch } from '../../search/flight/round-trip.state';
import { BookMode, BookType, BookState } from '../../book.state';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { StateReset } from 'ngxs-reset-plugin';
import { ResultState } from '../../result.state';
import { FlightPassengerState, SetFirstPassengers } from '../../passenger/flight.passenger.states';


export interface internationalBook {
    fareQuote: flightResult,
    ssr: SSR,
    isPriceChanged: boolean,
    flight: bookObj
}

export class GetFareQuoteSSR {
    static readonly type = "[international_book] GetFareQuoteSSR";

}

export class InternationalSendRequest {
    static readonly type = "[international_book] SendRequest";
    constructor(public comment: string, public mailCC: string[], public purpose: string) {

    }
}


@State<internationalBook>({
    name: 'international_book',
    defaults: {
        fareQuote: null,
        isPriceChanged: null,
        ssr: null,
        flight: {
            summary: null,
            trip: []
        }
    }
})

export class InternationalBookState {

    constructor(
        public store: Store,
        private flightService: FlightService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController
    ) {
    }

    @Selector()
    static getPassengerFare(states: internationalBook) {
        return states.fareQuote.Fare;
    }

    @Selector()
    static getFlightDetail(states: internationalBook): bookObj {
        return states.flight;
    }

    @Selector()
    static getTotalFare(states: internationalBook) : number {
        return states.flight.summary.total.reduce((acc,curr) => acc + curr.total,0);
    }

    @Action(GetFareQuoteSSR)
    async getFareQuoteSSR(states: StateContext<internationalBook>) {

        const loading = await this.loadingCtrl.create({
            spinner: "crescent"
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Book Failed',
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

        loading.message = "Checking Flight Availability";
        loading.present();

        let companyId = this.store.selectSnapshot(UserState.getcompanyId);
        states.dispatch(new GetCompany(companyId));

        try {
            const fairQuoteResponse = await this.flightService.fairQuote(this.store.selectSnapshot(InternationalResultState.getSelectedFlight).fareRule);
            if (fairQuoteResponse.status == 200) {
                let response = JSON.parse(fairQuoteResponse.data).response;
                if (response.Results) {
                    states.patchState({
                        fareQuote: response.Results,
                        isPriceChanged: response.IsPriceChanged,
                        flight: this.internationalbookData(response.Results)
                    });
                }
                else if (response.Error.ErrorCode == 6) {
                    console.log(response.Error.ErrorMessage);
                    loading.dismiss();
                    this.store.dispatch(new RoundTripSearch());
                    return;
                }
            }
        }
        catch (error) {
            console.log(error);
            if (error.status == -4) {
                loading.dismiss();
                failedAlert.message = "Timeout, Try Again";
                return;
            }
        }

        try {
            const SSRResponse = await this.flightService.SSR(this.store.selectSnapshot(InternationalResultState.getSelectedFlight).fareRule);
            if (SSRResponse.status == 200) {
                let response : SSR = JSON.parse(SSRResponse.data).response;
                states.patchState({
                    ssr: response
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
            }
        }
        catch (error) {
            console.log(error);
            if (error.status == -4) {
                loading.dismiss();
                failedAlert.message = "Timeout, Try Again";
                return;
            }
        }

        console.log(states.getState().fareQuote);

        states.dispatch(new SetFare(states.getState().fareQuote.Fare));
        states.dispatch(new SetFirstPassengers());
        states.dispatch(new BookMode('flight'));
        states.dispatch(new BookType('round-trip'));
        states.dispatch(new Navigate(['/', 'home', 'book', 'flight', 'round-trip', 'international']));
        loading.dismiss();

    }

    @Action(InternationalSendRequest)
    async internationalSendRequest(states: StateContext<internationalBook>, action: InternationalSendRequest) {

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
                    this.store.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
                    successAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                    this.store.dispatch(new StateReset(SearchState, ResultState, BookState));
                    this.modalCtrl.dismiss(null, null, 'book-confirm');
                }
            }]
        });

        loading.message = "Request Sending";
        loading.present();

        let sendReq: int_sendRequest = null;


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
            trip_mode: 1,
            fromValue: fromValue,
            toValue: toValue,
            onwardDate: this.store.selectSnapshot(RoundTripSearchState.getTravelDate),
            returnDate: this.store.selectSnapshot(RoundTripSearchState.getReturnDate),
            adultsType: this.store.selectSnapshot(RoundTripSearchState.getAdult),
            childsType: 0,
            infantsType: 0,
            countryFlag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? 0 :
                this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international' ? 1 : 0,
            tour: "1",
            client : null
        }

        let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
        let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
        let userId: number = this.store.selectSnapshot(UserState.getUserId);
        let vendorId: number = environment.vendorID;

        sendReq = {
            passenger_details: {
                kioskRequest: kioskRequest,
                passenger: this.store.selectSnapshot(FlightPassengerState.getSelectedPassengers),
                flight_details: [states.getState().fareQuote],
                fareQuoteResults: [states.getState().fareQuote],
                country_flag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? "0" : "1",
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
                        vendor_id: environment.vendorID

                    },
                    selected_Return_plb_Value: ""
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
                        onward_markup: 0,
                        return_markup: 0,
                        markup_charges: 0,
                        other_taxes: 0,
                        taxable_fare : 0,
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
            managers: [this.store.selectSnapshot(UserState.getApprover).email],
            approval_mail_cc: action.mailCC,
            purpose: action.purpose,
            comments: '[\"' + action.comment + '\"]',

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

        console.log(JSON.stringify(sendReq));

        try {
            const sendReqResponse = await this.flightService.intSendRequest(sendReq);
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

    internationalbookData(data: flightResult): bookObj {

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
                    extraMeals: null,
                    extraBaggage: null,
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
                console.log(element);
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
        if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getDomesticServiceCharge) * this.store.selectSnapshot(RoundTripSearchState.getAdult);
        }
        else if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getInternationalServiceCharge) * this.store.selectSnapshot(RoundTripSearchState.getAdult);
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

        if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic') {
            if(domesticmarkup !== 0){
                return (fare / 100) * domesticmarkup;
            }
            else {
                return 0;
            }
        }
        else if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international') {
            if(intmarkup !== 0){
                return (fare / 100) * intmarkup;
            }
            else {
                return 0;
            }
        }
    }
}
