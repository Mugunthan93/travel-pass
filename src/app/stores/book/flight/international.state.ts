import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, FLightBookState, value, rt_kioskRequest, int_sendRequest, SetFare, SetMeal, SetBaggage, totalsummary, SetServiceCharge, GetPLB, SetTaxable, SetGST, baggage, meal, bookpayload, ticketpayload, servicebySegment } from '../flight.state';
import { flightResult, flightData, metrixBoard } from 'src/app/models/search/flight';
import { FlightResultState, SSR } from '../../result/flight.state';
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
import { flightpassenger, FlightPassengerState, SetFirstPassengers } from '../../passenger/flight.passenger.states';
import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { empty, from, iif, of, throwError } from "rxjs";
import { catchError, concatMap, flatMap, map } from "rxjs/operators";
import { PassengerState } from "../../passenger.state";
import { HTTPResponse } from "@ionic-native/http/ngx";
import { ApprovalService } from "src/app/services/approval/approval.service";


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

export class InternationalOfflineRequest {
  static readonly type = "[international_book] InternationalOfflineRequest";
  constructor(public comment: string, public mailCC: string[], public purpose: string) {

  }
}

export class InternationalTicket {
    static readonly type = "[international_book] InternationalTicket";
    constructor(public comment?: string, public mailCC?: string[], public purpose?: string) {

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

@Injectable()
export class InternationalBookState {

    constructor(
        public store: Store,
        private flightService: FlightService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public approvalService : ApprovalService
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
    getFareQuoteSSR(states: StateContext<internationalBook>) {

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
      let selectedFlight = this.store.selectSnapshot(InternationalResultState.getSelectedFlight).fareRule;

      return loading$
        .pipe(
          flatMap(
            () => states.dispatch([
              new SetServiceCharge(),
              new GetCompany(companyId)
            ])
          ),
          flatMap(() => from(this.flightService.fairQuote(selectedFlight))),
          flatMap((response) => {
            console.log(response);
            let fareQuote = JSON.parse(response.data).response.Results;
            console.log(fareQuote);
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
                            flight: this.internationalbookData(res.Results)
                        });
                        return of(JSON.parse(fairQuoteResponse.data).response.Results.IsLCC);
                    }
                    else if (res.Error.ErrorCode == 6) {
                        console.log(res.Error.ErrorMessage);
                        this.loadingCtrl.dismiss(null,null,'book-load');
                        this.store.dispatch(new RoundTripSearch());
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

                              if (response.MealDynamic) {
                                  states.dispatch(new SetMeal(this.segmentSSR(states,response.MealDynamic,'onward'),[]));
                                  states.dispatch(new SetMeal([],this.segmentSSR(states,response.MealDynamic,'return')));
                              }
                              else if (response.Meal) {
                                states.dispatch(new SetMeal(this.segmentSSR(states,response.Meal,'onward'),[]));
                                states.dispatch(new SetMeal([],this.segmentSSR(states,response.Meal,'return')));
                              }

                              if (response.Baggage) {
                                states.dispatch(new SetBaggage(this.segmentSSR(states,response.Baggage,'onward'),[]));
                                states.dispatch(new SetBaggage([],this.segmentSSR(states,response.Baggage,'return')));
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
                          new BookType('round-trip'),
                          new Navigate(['/', 'home', 'book', 'flight', 'round-trip','international'])
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
        );
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

      let sendReq = this.sendRequestPayload(states,action,'pending','online');
      console.log(JSON.stringify(sendReq));

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

    @Action(InternationalOfflineRequest)
    async internationalOfflineRequest(states: StateContext<internationalBook>, action: InternationalOfflineRequest) {

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

      let sendReq = this.sendRequestPayload(states,action,'open','offline');
      console.log(JSON.stringify(sendReq));

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

    @Action(InternationalTicket)
    internationalBookTicket(states: StateContext<internationalBook>, action: InternationalTicket) {

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
                    states.dispatch(new StateReset(SearchState,ResultState,FlightResultState,InternationalResultState,BookState,PassengerState,FlightPassengerState));
                }
            }]
        })).pipe(flatMap((el) => from(el.present())));

        let fairIndex = this.store.selectSnapshot(InternationalResultState.getSelectedFlight).fareRule;
        let sendReq: int_sendRequest = this.sendRequestPayload(states,action,'open','online');
        console.log(JSON.stringify(sendReq));

        let bkpl: bookpayload = null;
        let openreq = null;
        let bookres = null;
        let segpax = null;

        return loading$.pipe(
            flatMap(() =>  from(this.flightService.intSendRequest(sendReq,false))),
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
                        JourneyType: 1,
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
                    let approveObj = this.approveRequestPayload(states,response,sendReq,bookres,openreq,'booked','online');
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
    sendRequestPayload(states : StateContext<internationalBook>,action : InternationalSendRequest | InternationalTicket, rqstStatus : string,bookingmode : string) {

      let gst : { onward : GST, return : GST } = this.store.selectSnapshot(FLightBookState.getGST);
      let serviceCharge : number = this.store.selectSnapshot(FLightBookState.getServiceCharge);

      let vendorId: number = environment.vendorID;
      let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
      let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
      let userId: number = this.store.selectSnapshot(UserState.getUserId);
      let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
      let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();

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
          booking_mode : bookingmode,
          status : rqstStatus,
          trip_type : "business",
          transaction_id : null,
          customer_id: companyId,
          travel_date: this.store.selectSnapshot(RoundTripSearchState.getPayloadTravelDate),
          traveller_id: travellersId,
          user_id: userId,
          vendor_id: vendorId,
          trip_requests : this.store.selectSnapshot(RoundTripSearchState.getTripRequest)
      }
    }

    //approvereq for booking
    approveRequestPayload(states: StateContext<internationalBook>,response,sendReq,bookres,openreq, rqstStatus : string,bookingmode : string) {

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

        let fairIndex = this.store.selectSnapshot(InternationalResultState.getSelectedFlight).fareRule;
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
              country_flag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? 0 :
              this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international' ? 1 : 0,
              trace_Id: fairIndex.TraceId,
              published_fare: states.getState().fareQuote.Fare.PublishedFare +
              this.markupCharges(states.getState().fareQuote.Fare.PublishedFare),
              user_eligibility: {
                approverid: "airline",
                msg: null,
                company_type: "corporate"
            }
            },
            booking_mode: bookingmode,
            traveller_id: travellersId,
            travel_date: openreq.travel_date,
            comments: null,
            trip_requests:  this.store.selectSnapshot(RoundTripSearchState.getTripRequest),
            cancellation_remarks: null,
            trip_type: "business",
            customer_id: companyId,
            transaction_id: null,
            managers: manager,
            user_id: data.user_id,
            req_id: openreq.id,
            vendor_id: vendorId,
            purpose: null,
            status: rqstStatus
        }
    }

    internationalbookData(data: flightResult): bookObj {

        let paxcount = this.store.selectSnapshot(RoundTripSearchState.getAdult);
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

    totalSummary(data : flightResult, segment : flightData[][]) : totalsummary[] {

      let serviceCharge : number = this.store.selectSnapshot(FLightBookState.getServiceCharge);
      let gst = this.store.selectSnapshot(FLightBookState.getGST);

      let taxkey = _.keyBy(data.Fare.TaxBreakup,(o) => {
          console.log(o);
          return o.key;
      })

      console.log(taxkey);
      let taxval = _.mapValues(taxkey,(o) => o.value);

      return _.chain(segment).map((el : flightData[], index : number) => {
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
    }).take(1).value();

    }

    bookingPerson() {
      let users = this.store.selectSnapshot(CompanyState.getEmployees);
      let admins = users.filter(user => user.role == 'admin' && user.is_rightsto_book !== null && user.is_rightsto_book);
      return [admins[0].email];
    }

    markupPercentage() {
      let domesticmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);
      let intmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);

      if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic') {
          if(domesticmarkup !== 0){
              return domesticmarkup / 100;
          }
          else {
              return 0;
          }
      }
      else if (this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international') {
          if(intmarkup !== 0){
              return intmarkup / 100;
          }
          else {
              return 0;
          }
      }
  }

  paxArray(passenger : flightpassenger[]) {

    let fare = this.store.selectSnapshot(FLightBookState.getFare).onward;

    return _.chain(passenger)
    .map(((el : flightpassenger) => {

        let newel : any = {
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

        if(el.IsLeadPax) {
          newel.PassportExpiry = el.PassportExpiry;
          newel.PassportNo = el.PassportNo;
        }

        return newel;
    }))
    .value();
  }

  segmentSSR(states : StateContext<internationalBook>, services : meal[] | baggage[] | any[],type : string) {

    let onwardSource = states.getState().fareQuote.Segments[0][0].Origin.Airport.AirportCode;
    let onwardDestiation = _.last(states.getState().fareQuote.Segments[0]).Destination.Airport.AirportCode;

    let onwardSegmentService : servicebySegment[] =  states.getState().fareQuote.Segments[0].map((el) => {
      return {
        Origin : el.Origin.Airport.CityCode,
        Destination : el.Destination.Airport.CityCode,
        service : _.flatMapDeep(services).filter((e : any) => e.Origin == el.Origin && e.Destination == el.Destination)
      }

    }).flat();

    onwardSegmentService.push({
        Origin : onwardSource,
        Destination : onwardDestiation,
        service : _.flatMapDeep(services).filter((e : any) => e.Origin == onwardSource && e.Destination == onwardDestiation)
    });

    let returnSource = onwardDestiation;
    let returnDestiation = onwardSource;

    let returnSegmentService : servicebySegment[] =  states.getState().fareQuote.Segments[1].map((el) => {
      return {
        Origin : el.Origin.Airport.CityCode,
        Destination : el.Destination.Airport.CityCode,
        service : _.flatMapDeep(services).filter((e : any) => e.Origin == el.Origin && e.Destination == el.Destination)
      }

    }).flat();

    returnSegmentService.push({
      Origin : returnSource,
      Destination : returnDestiation,
      service : _.flatMapDeep(services).filter((e : any) => e.Origin == returnSource && e.Destination == returnDestiation)
  });

    return type == "onward" ? onwardSegmentService : returnSegmentService;
  }
}
