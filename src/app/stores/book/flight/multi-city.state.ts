import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, FLightBookState, sendRequest, kioskRequest, value, SetFare, SetMeal, SetBaggage, totalsummary, SetServiceCharge, GetPLB, SetTaxable, SetGST, baggage, meal, bookpayload, ticketpayload, servicebySegment } from '../flight.state';
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
import { MultiCityResultState } from '../../result/flight/multi-city.state';
import { MultiCitySearch, MultiCitySearchState } from '../../search/flight/multi-city.state';
import { GST } from './oneway.state';
import { BookMode, BookType, BookState } from '../../book.state';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { StateReset } from 'ngxs-reset-plugin';
import { ResultState } from '../../result.state';
import { flightpassenger, FlightPassengerState, SetFirstPassengers } from '../../passenger/flight.passenger.states';
import { Injectable } from "@angular/core";
import { internationalBook } from "./international.state";
import * as _ from 'lodash';
import { empty, from, iif, of, throwError } from "rxjs";
import { catchError, concatMap, flatMap, map } from "rxjs/operators";
import { PassengerState } from "../../passenger.state";
import { HTTPResponse } from "@ionic-native/http/ngx";
import { ApprovalService } from "src/app/services/approval/approval.service";


export interface multicityBook {
    fareQuote: flightResult,
    ssr: SSR,
    isPriceChanged: boolean,
    flight: bookObj
}

export class GetFareQuoteSSR {
    static readonly type = "[multicity_book] GetFareQuoteSSR";

}

export class MultiCitySendRequest {
    static readonly type = "[multicity_book] MultiCitySendRequest";
    constructor(public comment: string, public mailCC: string[], public purpose: string) {

    }
}

export class MultiCityOfflineRequest {
  static readonly type = "[multicity_book] MultiCityOfflineRequest";
  constructor(public comment: string, public mailCC: string[], public purpose: string) {

  }
}


@State<multicityBook>({
    name: 'multicity_book',
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
export class MultiCityBookState {

    constructor(
        public store: Store,
        private flightService: FlightService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        private approvalService : ApprovalService
    ) {
    }

    @Selector()
    static getPassengerFare(states: multicityBook) {
        return states.fareQuote.Fare;
    }

    @Selector()
    static getFlightDetail(states: multicityBook): bookObj {
        return states.flight;
    }

    @Selector()
    static getTotalFare(states: internationalBook) : number {
        return states.flight.summary.total.reduce((acc,curr) => acc + curr.total,0);
    }

    @Action(GetFareQuoteSSR)
    getFareQuoteSSR(states: StateContext<multicityBook>) {

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
      let selectedFlight = this.store.selectSnapshot(MultiCityResultState.getSelectedFlight).fareRule;

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
                              flight: this.multicitybookData(res.Results)
                          });
                          return of(JSON.parse(fairQuoteResponse.data).response.Results.IsLCC);
                      }
                      else if (res.Error.ErrorCode == 6) {
                          console.log(res.Error.ErrorMessage);
                          this.loadingCtrl.dismiss(null,null,'book-load');
                          this.store.dispatch(new MultiCitySearch());
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
                                states.dispatch(new SetMeal(this.segmentSSR(states,response.MealDynamic),[]));
                            }
                            else if (response.Meal) {
                              states.dispatch(new SetMeal(this.segmentSSR(states,response.Meal),[]));
                            }

                            if (response.Baggage) {
                              states.dispatch(new SetBaggage(this.segmentSSR(states,response.Baggage),[]));
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
                          new BookType('multi-city'),
                          new Navigate(['/', 'home', 'book', 'flight', 'multi-city'])
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

    @Action(MultiCitySendRequest)
    async multicitySendRequest(states: StateContext<multicityBook>, action: MultiCitySendRequest) {

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
                    this.modalCtrl.dismiss(null, null,'book-confirm');
                }
            }]
        });

        loading.message = "Request Sending";
        loading.present();

        let sendReq = this.sendRequestPayload(states,action,'pending','online');

        console.log(JSON.stringify(sendReq));

        try {
            const sendReqResponse = await this.flightService.sendRequest(sendReq);
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

    @Action(MultiCityOfflineRequest)
    async multicityOfflineRequest(states: StateContext<multicityBook>, action: MultiCityOfflineRequest) {

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
                    this.modalCtrl.dismiss(null, null,'book-confirm');
                }
            }]
        });

        loading.message = "Request Sending";
        loading.present();

        let sendReq = this.sendRequestPayload(states,action,'open','offline');

        console.log(JSON.stringify(sendReq));

        try {
            const sendReqResponse = await this.flightService.sendRequest(sendReq);
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

    //sendrequest for approval & booking
    sendRequestPayload(states : StateContext<multicityBook>,action : MultiCitySendRequest, rqstStatus : string, bookingmode : string) {

      let gst : { onward : GST, return : GST } = this.store.selectSnapshot(FLightBookState.getGST);
      let serviceCharge : number = this.store.selectSnapshot(FLightBookState.getServiceCharge);

      let vendorId: number = environment.vendorID;
      let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
      let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
      let userId: number = this.store.selectSnapshot(UserState.getUserId);
      let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
      let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();

      let fromCity: city = this.store.selectSnapshot(MultiCitySearchState.getFromValue);
      let toCity: city = this.store.selectSnapshot(MultiCitySearchState.getToValue);
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
          onwardDate: this.store.selectSnapshot(MultiCitySearchState.getTravelDate),
          returnDate: 0,
          adultsType: this.store.selectSnapshot(MultiCitySearchState.getAdult),
          childsType: 0,
          infantsType: 0,
          countryFlag: this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'domestic' ? 0 :
              this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'international' ? 1 : 0,
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
              country_flag: this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'domestic' ? "0" : "1",
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
          travel_date: this.store.selectSnapshot(MultiCitySearchState.getPayloadTravelDate),
          traveller_id: travellersId,
          user_id: userId,
          vendor_id: vendorId,
          trip_requests : this.store.selectSnapshot(MultiCitySearchState.getTripRequest)
      }
    }

    //approvereq for booking
    approveRequestPayload(states: StateContext<multicityBook>,response,sendReq,bookres,openreq, rqstStatus : string, bookingmode : string) {

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

      let fairIndex = this.store.selectSnapshot(MultiCityResultState.getSelectedFlight).fareRule;
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
            country_flag: this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'domestic' ? 0 :
            this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'international' ? 1 : 0,
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
          trip_requests:  this.store.selectSnapshot(MultiCitySearchState.getTripRequest),
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

    bookingPerson() {
      let users = this.store.selectSnapshot(CompanyState.getEmployees);
      let admins = users.filter(user => user.role == 'admin' && user.is_rightsto_book !== null && user.is_rightsto_book);
      return [admins[0].email];
    }

    markupPercentage() {
      let domesticmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);
      let intmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);

      if (this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'domestic') {
          if(domesticmarkup !== 0){
              return domesticmarkup / 100;
          }
          else {
              return 0;
          }
      }
      else if (this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'international') {
          if(intmarkup !== 0){
              return intmarkup / 100;
          }
          else {
              return 0;
          }
      }
    }

    multicitybookData(data: flightResult): bookObj {

      let paxcount = this.store.selectSnapshot(MultiCitySearchState.getAdult)

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

    markupCharges(fare : number): number {
        let domesticmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);
        let intmarkup = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge);

        if (this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'domestic') {
            if(domesticmarkup !== 0){
                return (fare / 100) * domesticmarkup;
            }
            else {
                return 0;
            }
        }
        else if (this.store.selectSnapshot(MultiCitySearchState.getTripType) == 'international') {
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

  segmentSSR(states : StateContext<multicityBook>, services : meal[] | baggage[] | any[]) {

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

    return onwardSegmentService;
  }
}
