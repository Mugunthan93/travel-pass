import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, FLightBookState, sendRequest, kioskRequest, value, SetFare, SetMeal, SetBaggage, bookpayload, ticketpayload, totalsummary, taxes, plb, GetPLB, baggage, meal, managers, SetServiceCharge, SetGST, SetTaxable } from '../flight.state';
import { flightResult, flightData, metrixBoard } from 'src/app/models/search/flight';
import { FlightResultState, SSR } from '../../result/flight.state';
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
import { flightpassenger, FlightPassengerState, SetFirstPassengers } from '../../passenger/flight.passenger.states';
import { concat, empty, from, iif, of, throwError } from "rxjs";
import { catchError, concatMap, delay, flatMap, map, tap } from "rxjs/operators";
import { HTTPResponse } from "@ionic-native/http/ngx";
import { ApprovalService } from "src/app/services/approval/approval.service";
import { AgencyState } from "../../agency.state";
import { Injectable } from "@angular/core";
import { PassengerState } from "../../passenger.state";


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

export class FlightOneWaySendRequest {
    static readonly type = "[OneWay] FlightOneWaySendRequest";
    constructor(public comment: string, public mailCC: string[], public purpose: string) {

    }
}

export class ChooseBaggage {
    static readonly type = "[OneWay] SetBaggage";
    constructor(public flightIndex: number, public baggage: number) {

    }
}

export class ChooseMeal {
    static readonly type = "[OneWay] SetMeal";
    constructor(public flightIndex: number, public meal: number) {

    }
}

export class BookOneWayTicket {
    static readonly type = "[OneWay] BookOneWayTicket";
    constructor(public comment: string = null, public mailCC: string[] = null, public purpose: string = null) {

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

@Injectable()
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

    @Selector()
    static getTotalFare(states: onewayBook) : number {
        return states.flight.summary.total.reduce((acc,curr) => acc + curr.total,0);
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
        return loading$
            .pipe(
                flatMap(() => states.dispatch([
                    new SetServiceCharge(),
                    new GetCompany(companyId)
                ])),
                flatMap(() => from(this.flightService.fairQuote(selectedFlight))),
                flatMap((response) => {
                    console.log(response);
                    let fareQuote = JSON.parse(response.data).response.Results;
                    if(JSON.parse(response.data).response.Error.ErrorCode == 2) {
                        return throwError({
                            error : JSON.parse(response.data).response.Error.ErrorMessage
                        });
                    }
                    return states.dispatch([
                        new SetFare(fareQuote.Fare),
                        new GetPLB(fareQuote),
                        new SetTaxable(),
                        new SetGST()
                    ]).pipe(
                        flatMap(() => {
                            return of(response);
                        })
                    );
                }),
                flatMap(
                    (fairQuoteResponse) => {

                        if (fairQuoteResponse.status == 200) {
                            let res = JSON.parse(fairQuoteResponse.data).response;
                            if (res.Results) {
                                states.patchState({
                                    fareQuote: res.Results,
                                    isPriceChanged: res.IsPriceChanged,
                                    flight: this.onewaybookData(res.Results)
                                });
                                return of(JSON.parse(fairQuoteResponse.data).response.Results.IsLCC);
                            }
                            else if (res.Error.ErrorCode == 6) {
                                console.log(res.Error.ErrorMessage);
                                this.loadingCtrl.dismiss(null,null,'book-load');
                                this.store.dispatch(new OneWaySearch());
                                return of(false);
                            }
                            else if (res.Error.ErrorCode == 2) {
                                console.log(res.Error.ErrorMessage);
                                this.loadingCtrl.dismiss(null,null,'book-load');
                                failedAlert$(res.Error.ErrorMessage);
                                return of(false);
                            }
                        }
                        return of(JSON.parse(fairQuoteResponse.data).response.Results.IsLCC);
                    }
                ),
                concatMap((response) => {
                    return iif(() => response,
                    from(this.flightService.SSR(selectedFlight))
                    .pipe(
                        map(
                            (ssrReponse) => {
                                console.log(JSON.stringify(ssrReponse));
                                console.log(ssrReponse);
                                if (ssrReponse.status == 200) {
                                    let response : SSR = JSON.parse(ssrReponse.data).response;
                                    console.log(response);
                                    states.patchState({
                                        ssr : response
                                    });
                                    let baggagebySegment = (services : baggage[]) => {

                                        let firstorder = _.chain(services)
                                            .groupBy("Origin")
                                            .map((originVal,originKey) => {
                                                return _.chain(originVal)
                                                    .groupBy("Destination")
                                                    .map((val,key) => {
                                                        return {
                                                            Origin : originKey,
                                                            Destination : key,
                                                            service : _.flatMapDeep(val).filter((el : baggage) => el.Origin == originKey && el.Destination == key)
                                                        }
                                                    }).value();
                                            })
                                            .value()
                                        console.log(firstorder);

                                        return states.getState().fareQuote.Segments.map((el) => {
                                            return el.map((e) => {
                                                return {
                                                    Origin : e.Origin.Airport.CityCode,
                                                    Destination : e.Destination.Airport.CityCode,
                                                    service : _.flatMapDeep(services).filter((el : baggage) => el.Origin == e.Origin.Airport.CityCode && el.Destination == e.Destination.Airport.CityCode)
                                                }
                                            })
                                        })
                                    }

                                    let mealbySegment = (services : meal[]) => {

                                        let firstorder = _.chain(services)
                                            .groupBy("Origin")
                                            .map((originVal,originKey) => {
                                                return _.chain(originVal)
                                                    .groupBy("Destination")
                                                    .map((val,key) => {
                                                        return {
                                                            Origin : originKey,
                                                            Destination : key,
                                                            service : _.flatMapDeep(val).filter((el : meal) => el.Origin == originKey && el.Destination == key)
                                                        }
                                                    }).value();
                                            })
                                            .value()
                                        console.log(firstorder);


                                        return states.getState().fareQuote.Segments.map((el) => {
                                            return el.map((e) => {
                                                return {
                                                    Origin : e.Origin.Airport.CityCode,
                                                    Destination : e.Destination.Airport.CityCode,
                                                    service : _.flatMapDeep(services).filter((el : meal) => el.Origin == e.Origin.Airport.CityCode && el.Destination == e.Destination.Airport.CityCode)
                                                }
                                            })
                                        })
                                    }

                                    let bySegment = (services : any[]) => {

                                        let firstorder = _.chain(services)
                                            .groupBy("Origin")
                                            .map((originVal,originKey) => {
                                                return _.chain(originVal)
                                                    .groupBy("Destination")
                                                    .map((val,key) => {
                                                        return {
                                                            Origin : originKey,
                                                            Destination : key,
                                                            service : _.flatMapDeep(val).filter((el : any) => el.Origin == originKey && el.Destination == key)
                                                        }
                                                    }).value();
                                            })
                                            .value()
                                        console.log(firstorder);


                                        return states.getState().fareQuote.Segments.map((el) => {
                                            return el.map((e) => {
                                                return {
                                                    Origin : e.Origin.Airport.CityCode,
                                                    Destination : e.Destination.Airport.CityCode,
                                                    service : _.flatMapDeep(services).filter((el : any) => el.Origin == e.Origin.Airport.CityCode && el.Destination == e.Destination.Airport.CityCode)
                                                }
                                            })
                                        })
                                    }

                                    if (response.MealDynamic) {
                                        states.dispatch(new SetMeal(bySegment(response.MealDynamic).flat(), []));
                                    }
                                    else if (response.Meal) {
                                        states.dispatch(new SetMeal(mealbySegment(response.Meal).flat(), []));
                                    }

                                    if (response.Baggage) {
                                        states.dispatch(new SetBaggage(baggagebySegment(response.Baggage).flat(), []));
                                    }
                                    return true;
                                }
                                return true;
                            }
                        )
                    )
                    ,of(true))
                }),
                flatMap(
                    (response) => {
                        if(response) {
                            console.log(response);
                            states.dispatch([
                                new SetFirstPassengers(),
                                new BookMode('flight'),
                                new BookType('one-way'),
                                new Navigate(['/', 'home', 'book', 'flight', 'one-way'])
                            ])
                            return from(this.loadingCtrl.dismiss(null,null,'book-load'));
                        }
                        else {
                            return empty();
                        }
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

        let sendReq = this.sendRequestPayload(states,action);
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

    @Action(ChooseBaggage)
    chooseBaggage(states: StateContext<onewayBook>, action: ChooseBaggage) {
      console.log(states,action);
        // states.setState(patch({
        //     flight : patch({
        //         summary : patch({
        //             total : updateItem((el : totalsummary) => el.id == action.flightIndex,patch({
        //                 extraBaggage : action.baggage
        //             }))
        //         })
        //     })
        // }));
    }

    @Action(ChooseMeal)
    chooseMeal(states: StateContext<onewayBook>, action: ChooseMeal) {
      console.log(states,action);
        // states.setState(patch({
        //     flight : patch({
        //         summary : patch({
        //             total : updateItem((el : totalsummary) => el.id == action.flightIndex,patch({
        //                 extraMeals : action.meal
        //             }))
        //         })
        //     })
        // }));
    }

    @Action(BookOneWayTicket)
    bookOneWayTicket(states: StateContext<onewayBook>, action: BookOneWayTicket) {

        console.log(action);
        let loading$ = from(this.loadingCtrl.create({
            spinner: "crescent",
            message : "Booking Ticket...",
            id : 'loading-book'
        })).pipe(flatMap((el) => from(el.present())));

        let failedAlert = (msg : string) => from(this.alertCtrl.create({
            header: 'Booking Failed',
            message: msg,
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
                    states.dispatch(new StateReset(SearchState,ResultState,FlightResultState,OneWayResultState,BookState,PassengerState,FlightPassengerState));
                }
            }]
        })).pipe(flatMap((el) => from(el.present())));

        let fairIndex = this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule;
        let sendReq: sendRequest = this.sendRequestPayload(states,action);
        console.log(JSON.stringify(sendReq));

        let bkpl: bookpayload = null;
        let openreq = null;
        let bookres = null;
        let segpax = null;

        return loading$.pipe(
            flatMap(() =>  from(this.flightService.sendRequest(sendReq,false))),
            flatMap(
                (response : HTTPResponse) => {

                    console.log(response);
                    openreq = JSON.parse(response.data).data;
                    //open req json
                    console.log(JSON.stringify(openreq));
                    segpax = this.paxArray(openreq.passenger_details.passenger);
                    bkpl = {
                        Passengers : segpax,
                        TraceId: fairIndex.TraceId,
                        JourneyType: openreq.trip_requests.JourneyType,
                        IsLCC: openreq.passenger_details.flight_details[0].IsLCC,
                        ResultIndex: fairIndex.ResultIndex
                    }

                    console.log(bkpl);
                    console.log(JSON.stringify(bkpl));
                    return from(this.flightService.bookFlight(bkpl));
                }
            ),
            flatMap(
                (response) => {
                    console.log(response);
                    bookres = JSON.parse(response.data);

                    if(bookres.response.Response == null) {
                        console.log(bookres);
                        return throwError(bookres.response);
                    }

                    //book res json
                    console.log(JSON.stringify(bookres));
                    let metrix : metrixBoard = {
                        type_of_booking: "airline",
                        sector: {
                          api: "/airlines/book",
                          Book_request: bkpl,
                          book_response: response,
                          request_id: openreq.id,
                          fareQuote_onward: states.getState().fareQuote,
                          fareQuote_return: ""
                        }
                    }

                    console.log(JSON.stringify(metrix));
                    return from(this.flightService.metrixboard(metrix));
                }
            ),
            flatMap(
                (response) => {
                    let approveObj = this.approveRequestPayload(states,response,sendReq,bookres,openreq);
                    console.log(JSON.stringify(approveObj));
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
            ),
            catchError(
                (error : HTTPResponse | any) => {

                    this.loadingCtrl.dismiss(null,null,'loading-book');
                    console.log(error);
                    if(error.status = 502) {
                        return failedAlert("Problem with request book API,Please try later");
                    }
                    else {
                        return failedAlert(error.Error.ErrorMessage);
                    }

                }
            )
        );


    }

    //sendrequest for approval & booking
    sendRequestPayload(states : StateContext<onewayBook>,action : FlightOneWaySendRequest | BookOneWayTicket) {

        let gst : { onward : GST, return : GST } = this.store.selectSnapshot(FLightBookState.getGST);
        let serviceCharge : number = this.store.selectSnapshot(FLightBookState.getServiceCharge);

        let vendorId: number = environment.vendorID;
        let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
        let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
        let userId: number = this.store.selectSnapshot(UserState.getUserId);
        let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
        let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();

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

        let taxkey = _.keyBy(states.getState().fareQuote.Fare.TaxBreakup,(o) => {
            console.log(o);
            return o.key;
        })

        console.log(taxkey);
        let taxval = _.mapValues(taxkey,(o) => o.value);
        console.log(taxval);
        let taxable = this.store.selectSnapshot(FLightBookState.getTaxable).onward;

        return {
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
                        K3: taxval.K3,
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
                        cgst_Charges: gst.onward.cgst,
                        sgst_Charges: gst.onward.sgst,
                        igst_Charges: gst.onward.igst,
                        service_charges: serviceCharge,
                        total_amount: (
                            states.getState().fareQuote.Fare.PublishedFare +
                            this.markupCharges(states.getState().fareQuote.Fare.PublishedFare) +
                            states.getState().fareQuote.Fare.OtherCharges +
                            serviceCharge +
                            gst.onward.sgst +
                            gst.onward.cgst +
                            gst.onward.igst),
                        cgst_onward: 0,
                        sgst_onward: 0,
                        igst_onward: 0,
                        sgst_return: 0,
                        cgst_return: 0,
                        igst_return: 0,
                        taxable_fare : taxable,
                        onward_markup: this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
                        return_markup: 0,
                        markup_charges: this.markupPercentage(),
                        other_taxes: 0,
                        vendor: {
                            service_charges: serviceCharge,
                            GST: gst.onward.cgst + gst.onward.sgst,
                            CGST : 0,
                            SGST : 0,
                            IGST : gst.onward.cgst + gst.onward.sgst
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
            approval_mail_cc: action.mailCC,
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
    }

    //approvereq for booking
    approveRequestPayload(states: StateContext<onewayBook>,response,sendReq,bookres,openreq) {

        let data = JSON.parse(response.data);
        console.log(data,response);

        //metrix json
        console.log(JSON.stringify(data));
        let pnr = JSON.stringify([bookres.response.Response.PNR.toString()])
        let bookingid = JSON.stringify([bookres.response.Response.BookingId.toString()]);
        console.log(pnr,bookingid);

        let taxkey = _.keyBy(states.getState().fareQuote.Fare.TaxBreakup,(o) => {
            console.log(o);
            return o.key;
        })

        console.log(taxkey);
        let taxval = _.mapValues(taxkey,(o) => o.value);
        console.log(taxval);

        let fairIndex = this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule;
        let vendorId: number = environment.vendorID;
        let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
        let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
        let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
        let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();

        let bookresponse = bookres;
        let newSegments = (bookresponse.response.Response.FlightItinerary.Segments as [])
            .map(
                (el : any) => {
                    el.Passenger = bookresponse.response.Response.FlightItinerary.Passenger
                    return el;
                }
            );
        bookresponse.response.Response.FlightItinerary.Segments = newSegments;

        return{
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
                    K3: taxval.K3,
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
                charges_details: sendReq.passenger_details.fare_response.charges_details,
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
    }

    ///for farequote
    onewaybookData(data: flightResult): bookObj {

        let paxcount = this.store.selectSnapshot(OneWaySearchState.getAdult);
        let book: bookObj = {
            summary: {
                fare: {
                    base: data.Fare.BaseFare,
                    taxes: data.Fare.Tax,
                    ot : (data.Fare.OtherCharges / paxcount)
                },
                total: this.totalSummary(data,data.Segments)

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

    totalSummary(data : flightResult, segment : flightData[][]) : totalsummary[] {

        let serviceCharge : number = this.store.selectSnapshot(FLightBookState.getServiceCharge);
        let gst = this.store.selectSnapshot(FLightBookState.getGST);

        let taxkey = _.keyBy(data.Fare.TaxBreakup,(o) => {
            console.log(o);
            return o.key;
        })

        console.log(taxkey);
        let taxval = _.mapValues(taxkey,(o) => o.value);

        return segment.map(
            (el : flightData[], index : number) => {
                return {
                    id : index,
                    source : el[0].Origin.Airport.AirportCode,
                    destination : _.last(el).Destination.Airport.AirportCode,
                    serviceCharge: serviceCharge,
                    SGST: gst.onward.sgst,
                    CGST: gst.onward.cgst,
                    IGST: gst.onward.igst,
                    flight: (data.Fare.PublishedFare - data.Fare.TaxBreakup[0].value) + this.markupCharges(data.Fare.PublishedFare),
                    k3: taxval.K3,
                    other: data.Fare.OtherCharges,
                    extraMeals: 0,
                    extraBaggage: 0,
                    total: (
                        data.Fare.PublishedFare +
                        this.markupCharges(data.Fare.PublishedFare) +
                        data.Fare.OtherCharges +
                        serviceCharge +
                        gst.onward.sgst +
                        gst.onward.cgst +
                        gst.onward.igst),
                    currency: data.FareBreakdown[0].Currency
                }
            }
        );
    }

    paxArray(passenger : flightpassenger[]) {

        let fare = this.store.selectSnapshot(FLightBookState.getFare);

        return _.chain(passenger)
        .map(((el : flightpassenger) => {
            let newel = {
                AddressLine1: el.AddressLine1,
                City: el.City,
                CountryName: el.CountryName,
                CountryCode: el.CountryCode,
                Email: el.Email,
                PaxType: el.PaxType,
                IsLeadPax: el.IsLeadPax,
                FirstName: el.FirstName,
                LastName: el.LastName,
                ContactNo: el.ContactNo,
                DateOfBirth:el.DateOfBirth,
                Title: el.Title,
                Gender: el.Gender,
                Fare : fare,
                Baggage : el.onwardExtraServices.Baggage,
                MealDynamic : el.onwardExtraServices.Meal
            }
            return newel;
        }))
        .value();
    }

}
