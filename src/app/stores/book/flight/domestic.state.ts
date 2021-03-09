import { Selector, Action, State, Store, StateContext } from '@ngxs/store';
import { flightResult, flightData, metrixBoard } from 'src/app/models/search/flight';
import { fareRule, FlightResultState, SSR } from '../../result/flight.state';
import { bookObj, value, FLightBookState, rt_uapi_params, rt_sendRequest, rt_kioskRequest, SetFare, SetMeal, SetBaggage, taxes, plb, totalsummary, SetServiceCharge, GetPLB, SetTaxable, SetGST, baggage, meal, bookpayload, ticketpayload, servicebySegment } from '../flight.state';
import { FlightService } from 'src/app/services/flight/flight.service';
import { DomesticResultState } from '../../result/flight/domestic.state';
import { RoundTripSearch, RoundTripSearchState } from '../../search/flight/round-trip.state';
import * as moment from 'moment';
import { CompanyState, GetCompany } from '../../company.state';
import { GST } from './oneway.state';
import { city } from '../../shared.state';
import { UserState } from '../../user.state';
import { environment } from 'src/environments/environment';
import { Navigate } from '@ngxs/router-plugin';
import { SearchState } from '../../search.state';
import { BookMode, BookState, BookType } from '../../book.state';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { StateReset } from 'ngxs-reset-plugin';
import { ResultState } from '../../result.state';
import { flightpassenger, FlightPassengerState, SetFirstPassengers } from '../../passenger/flight.passenger.states';
import { AgencyState } from '../../agency.state';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { concat, empty, forkJoin, from, iif, of, throwError } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { patch } from '@ngxs/store/operators';
import { ApprovalService } from 'src/app/services/approval/approval.service';
import { PassengerState } from '../../passenger.state';

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
    constructor(public comment: string, public mailCC: string[], public purpose: string) {

    }
}

export class DomesticOfflineRequest {
  static readonly type = "[Domestic] DomesticOfflineRequest";
  constructor(public comment: string, public mailCC: string[], public purpose: string) {

  }
}

export class DomesticTicket {
  static readonly type = "[Domestic] DomesticTicket";
  constructor(public comment: string = null, public mailCC: string[] = null, public purpose: string = null) {

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

@Injectable()
export class DomesticBookState {

    constructor(
        public store: Store,
        private flightService: FlightService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public modalCtrl:ModalController,
        private approvalService : ApprovalService
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

    @Selector()
    static getTotalFare(states: domesticBook) : number {
        return states.departure.flight.summary.total.reduce((acc,curr) => acc + curr.total,0) + states.return.flight.summary.total.reduce((acc,curr) => acc + curr.total,0);
    }

    @Action(GetFareQuoteSSR)
    getFareQuoteSSR(states: StateContext<domesticBook>) {

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
        let depselectedFlight = this.store.selectSnapshot(DomesticResultState.getSelectedDepartureFlight).fareRule;
        let reselectedFlight = this.store.selectSnapshot(DomesticResultState.getSelectedReturnFlight).fareRule;

        return loading$
            .pipe(
              flatMap(
                () => states.dispatch([
                  new SetServiceCharge(),
                  new GetCompany(companyId)
                ])
              ),
              flatMap(() => forkJoin([from(this.flightService.fairQuote(depselectedFlight)),from(this.flightService.fairQuote(reselectedFlight))])),
              flatMap(
                (response) => {

                  let depResponse = response[0];
                  let reResponse = response[1];

                  let depFareQuote = JSON.parse(depResponse.data).response.Results;
                  let reFareQuote = JSON.parse(reResponse.data).response.Results;

                  if(JSON.parse(depResponse.data).response.Error.ErrorCode == 2) {
                    return throwError({
                        error : JSON.parse(depResponse.data).response.Error.ErrorMessage
                    });
                  }
                  else if(JSON.parse(reResponse.data).response.Error.ErrorCode == 2) {
                    return throwError({
                        error : JSON.parse(reResponse.data).response.Error.ErrorMessage
                    });
                  }

                  return states.dispatch([
                    new SetFare(depFareQuote.Fare,reFareQuote.Fare),
                    new GetPLB(depFareQuote,reFareQuote),
                    new SetTaxable(),
                    new SetGST()
                    ])
                    .pipe(
                    flatMap(() => {
                        return forkJoin([of(depResponse),of(reResponse)])
                    }));
                }
              ),
              flatMap(
                (response) => {

                  let depResponse = response[0];
                  let reResponse = response[1];

                  let dep = JSON.parse(depResponse.data).response;
                  let re = JSON.parse(reResponse.data).response;

                  if(depResponse.status == 200 && reResponse.status == 200) {
                    if(dep.Results && re.Results) {
                      states.setState(patch({
                        departure : patch({
                          fareQuote: dep.Results,
                          isPriceChanged: dep.IsPriceChanged,
                          flight : this.domesticbookData(dep.Results,"onward")
                        }),
                        return : patch({
                          fareQuote: re.Results,
                          isPriceChanged: re.IsPriceChanged,
                          flight : this.domesticbookData(re.Results,"return")
                        })
                      }));
                    }
                    else if (dep.Error.ErrorCode == 6 || re.Error.ErrorCode == 6) {
                      console.log(dep.Error.ErrorMessage);
                      this.loadingCtrl.dismiss(null,null,'book-load');
                      this.store.dispatch(new RoundTripSearch());
                      return of(false);
                    }
                    else if (dep.Error.ErrorCode == 2) {
                      console.log(dep.Error.ErrorMessage);
                      this.loadingCtrl.dismiss(null,null,'book-load');
                      failedAlert$(dep.Error.ErrorMessage);
                      return of(false);
                    }
                    else if (re.Error.ErrorCode == 2) {
                        console.log(re.Error.ErrorMessage);
                        this.loadingCtrl.dismiss(null,null,'book-load');
                        failedAlert$(re.Error.ErrorMessage);
                        return of(false);
                    }
                  }

                  let depLCC = dep.Results.IsLCC;
                  let reLCC = re.Results.IsLCC;

                  return concat(
                    iif(
                      () => depLCC,
                      from(this.flightService.SSR(depselectedFlight))
                        .pipe(
                          map(
                            (ssrReponse) => {
                                console.log(JSON.stringify(ssrReponse));
                                console.log(ssrReponse);
                                if (ssrReponse.status == 200) {
                                    let response : SSR = JSON.parse(ssrReponse.data).response;
                                    console.log(response);
                                    states.setState(patch({
                                        departure : patch({
                                          ssr : response
                                        })
                                    }));

                                  if (response.MealDynamic) {
                                      states.dispatch(new SetMeal(this.segmentSSR(states,response.MealDynamic,'onward'),[]));
                                  }
                                  else if (response.Meal) {
                                    states.dispatch(new SetMeal(this.segmentSSR(states,response.Meal,'onward'),[]));
                                  }

                                  if (response.Baggage) {
                                    states.dispatch(new SetBaggage(this.segmentSSR(states,response.Baggage,'onward'),[]));
                                  }
                                    return true;
                                }
                                return true;
                            }
                          )
                        ),
                      of(true)
                      ),
                      iif(
                        () => reLCC,
                        from(this.flightService.SSR(reselectedFlight))
                          .pipe(
                            map(
                              (ssrReponse) => {
                                  console.log(JSON.stringify(ssrReponse));
                                  console.log(ssrReponse);
                                  if (ssrReponse.status == 200) {
                                      let response : SSR = JSON.parse(ssrReponse.data).response;
                                      console.log(response);
                                      states.setState(patch({
                                          return : patch({
                                            ssr : response
                                          })
                                      }));
                                      if (response.MealDynamic) {
                                        states.dispatch(new SetMeal([],this.segmentSSR(states,response.MealDynamic,'return')));
                                    }
                                    else if (response.Meal) {
                                      states.dispatch(new SetMeal([],this.segmentSSR(states,response.Meal,'return')));
                                    }

                                    if (response.Baggage) {
                                      states.dispatch(new SetBaggage([],this.segmentSSR(states,response.Baggage,'return')));
                                    }
                                      return true;
                                  }
                                  return true;
                              }
                            )
                          ),
                        of(true)
                      )
                  )

                }
              ),
              flatMap(
                (response) => {
                    if(response) {
                        console.log(response);
                        states.dispatch([
                            new SetFirstPassengers(),
                            new BookMode('flight'),
                            new BookType('animated-round-trip'),
                            new Navigate(['/', 'home', 'book', 'flight', 'round-trip','domestic'])
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

    @Action(DomesticSendRequest)
    async roundTripSendRequest(states: StateContext<domesticBook>, action: DomesticSendRequest) {

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

        let sendReq: rt_sendRequest = this.sendRequestPayload(states,action,"onward","pending","online");

        console.log(JSON.stringify(sendReq));

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

    @Action(DomesticOfflineRequest)
    async roundTripOfflineRequest(states: StateContext<domesticBook>, action: DomesticOfflineRequest) {

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

        let sendReq: rt_sendRequest = this.sendRequestPayload(states,action,"onward","open","offline");

        console.log(JSON.stringify(sendReq));

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

    @Action(DomesticTicket)
    domesticTicket(states : StateContext<domesticBook>, action: DomesticTicket) {

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
                  states.dispatch(new StateReset(SearchState,ResultState,FlightResultState,DomesticResultState,BookState,PassengerState,FlightPassengerState));
              }
          }]
      })).pipe(flatMap((el) => from(el.present())));

      let fareIndex = {
        onward : this.store.selectSnapshot(DomesticResultState.getSelectedDepartureFlight).fareRule,
        return : this.store.selectSnapshot(DomesticResultState.getSelectedReturnFlight).fareRule
      }

      let depSendreq: rt_sendRequest = this.sendRequestPayload(states,action,"onward","open","online");
      let reSendReq: rt_sendRequest = this.sendRequestPayload(states,action,"return","open","online");

      console.log(JSON.stringify(depSendreq),JSON.stringify(reSendReq));

      return loading$.pipe(
        flatMap(() => this.bookTicket(states,depSendreq,fareIndex.onward,"onward")),
        flatMap((response) => {
          if(response.status == 200) {
            return this.bookTicket(states,reSendReq,fareIndex.return,"return");
          }
          else {
            return failedAlert("ticket pdf generated but some problem occured")
              .pipe(
                flatMap(
                  () => {
                    return throwError(response);
                  }
                )
              );
          }
        }),
        flatMap(
          (response) => {
            if(response.status == 200) {
              return successAlert;
            }
            else {
              return failedAlert("ticket pdf generated but some problem occured")
              .pipe(
                flatMap(
                  () => {
                    return throwError(response);
                  }
                )
              );
            }
          }
        ),
        catchError(
          (error : HTTPResponse | any) => {
            console.log(error);
              this.loadingCtrl.dismiss(null,null,'loading-book');
              console.log(error);
              if(error.status = 502) {
                  return failedAlert("Problem with request book API,Please try later");
              }
              else if(error.status !== 200){
                return failedAlert(error.Error.ErrorMessage);
            }
            return of(error);

          }
        )
      );

    }

    domesticbookData(data: flightResult,type : string): bookObj {

        let paxcount = this.store.selectSnapshot(RoundTripSearchState.getAdult);
        let book: bookObj = {
            summary: {
                fare: {
                    base: data.Fare.BaseFare,
                    taxes: data.Fare.Tax,
                    ot: (data.Fare.OtherCharges / paxcount)
                },
                total: this.totalSummary(data,data.Segments,type)

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

    //sendrequest for approval & booking
    sendRequestPayload(states : StateContext<domesticBook>,action : DomesticSendRequest | DomesticTicket, type : string,rqstStatus : string, bookingmode : string) {

      let allGST : { onward : GST, return : GST } = {
        onward : type == "onward" ?  this.store.selectSnapshot(FLightBookState.getGST).onward : this.store.selectSnapshot(FLightBookState.getGST).return,
        return : type == "onward" ?  this.store.selectSnapshot(FLightBookState.getGST).return : this.store.selectSnapshot(FLightBookState.getGST).onward
      };
      let serviceCharge : number = this.store.selectSnapshot(FLightBookState.getServiceCharge);

      let depfareQuote = type == "onward" ?  states.getState().departure.fareQuote :  states.getState().return.fareQuote;
      let refareQuote = type == "onward" ?  states.getState().return.fareQuote :  states.getState().departure.fareQuote;

      let depPrice = type == "onward" ?  states.getState().departure.isPriceChanged :  states.getState().return.isPriceChanged;
      let rePrice = type == "onward" ?  states.getState().return.isPriceChanged :  states.getState().departure.isPriceChanged;

      let vendorId: number = environment.vendorID;
      let travellersId: number = this.store.selectSnapshot(UserState.getUserId);
      let companyId: number = this.store.selectSnapshot(UserState.getcompanyId);
      let userId: number = this.store.selectSnapshot(UserState.getUserId);
      let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
      let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();

      let fromCity: city = type == "onward" ? this.store.selectSnapshot(RoundTripSearchState.getFromValue) : this.store.selectSnapshot(RoundTripSearchState.getToValue);
      let toCity: city = type == "onward" ? this.store.selectSnapshot(RoundTripSearchState.getToValue) : this.store.selectSnapshot(RoundTripSearchState.getFromValue);
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
          onwardDate: type == "onward" ? this.store.selectSnapshot(RoundTripSearchState.getTravelDate) : this.store.selectSnapshot(RoundTripSearchState.getReturnDate),
          returnDate: type == "onward" ? this.store.selectSnapshot(RoundTripSearchState.getReturnDate) : this.store.selectSnapshot(RoundTripSearchState.getTravelDate),
          adultsType: this.store.selectSnapshot(RoundTripSearchState.getAdult),
          childsType: 0,
          infantsType: 0,
          countryFlag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? 0 :
              this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international' ? 1 : 0,
          tour: "1",
          client : null
      }

      let onwardtaxkey = _.keyBy(depfareQuote.Fare.TaxBreakup,(o) => o.key)
      let onwardtaxval = _.mapValues(onwardtaxkey,(o) => o.value);

      let returntaxkey = _.keyBy(refareQuote.Fare.TaxBreakup,(o) => o.key)
      let returntaxval = _.mapValues(returntaxkey,(o) => o.value);

      let uapi_params: rt_uapi_params = {
        selected_plb_Value: {
            K3: onwardtaxval.K3,
            PLB_earned: depfareQuote.Fare.PLBEarned,
            queuenumber: 0,
            PCC: 0,
            consolidator_name: 'ONLINE FARE',
            vendor_id: environment.vendorID

        },
        selected_Return_plb_Value: {
            K3: returntaxval.K3,
            PLB_earned: refareQuote.Fare.PLBEarned,
            queuenumber: 0,
            PCC: 0,
            consolidator_name: 'ONLINE FARE',
            vendor_id: environment.vendorID
        }
      }

      let published_fare = (
        depfareQuote.Fare.PublishedFare +
        this.markupCharges(depfareQuote.Fare.PublishedFare) +
        depfareQuote.Fare.OtherCharges +
        serviceCharge +
        allGST.onward.sgst +
        allGST.onward.cgst +
        allGST.onward.igst
        ) + (
        refareQuote.Fare.PublishedFare +
        this.markupCharges(refareQuote.Fare.PublishedFare) +
        refareQuote.Fare.OtherCharges +
        serviceCharge +
        allGST.return.sgst +
        allGST.return.cgst +
        allGST.return.igst
      );

      let taxable = this.store.selectSnapshot(FLightBookState.getTaxable);
      return {
        passenger_details: {
            kioskRequest: kioskRequest,
            passenger: this.store.selectSnapshot(FlightPassengerState.getSelectedPassengers),
            flight_details: [depfareQuote, refareQuote],
            fareQuoteResults: [depfareQuote, refareQuote],
            country_flag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? "0" : "1",
            user_eligibility: {
                approverid: "airline",
                msg: null,
                company_type: "corporate"
            },
            published_fare: (depfareQuote.Fare.PublishedFare - depfareQuote.Fare.TaxBreakup[0].value) + this.markupCharges(depfareQuote.Fare.PublishedFare) + (refareQuote.Fare.PublishedFare - refareQuote.Fare.TaxBreakup[0].value) + this.markupCharges(refareQuote.Fare.PublishedFare),
            uapi_params: uapi_params,
            fare_response: {
                published_fare: (depfareQuote.Fare.PublishedFare - depfareQuote.Fare.TaxBreakup[0].value) + this.markupCharges(depfareQuote.Fare.PublishedFare) + (refareQuote.Fare.PublishedFare - refareQuote.Fare.TaxBreakup[0].value) + this.markupCharges(refareQuote.Fare.PublishedFare),
                cancellation_risk: this.store.selectSnapshot(FLightBookState.getRisk),
                charges_details: {
                    GST_total: 0,
                    agency_markup: 0,
                    cgst_Charges: allGST.onward.cgst + allGST.return.cgst,
                    sgst_Charges: allGST.onward.sgst + allGST.return.sgst,
                    igst_Charges: allGST.onward.igst + allGST.return.igst,
                    service_charges: serviceCharge,
                    total_amount: published_fare,
                    cgst_onward: allGST.onward.cgst,
                    sgst_onward: allGST.onward.sgst,
                    igst_onward: allGST.onward.igst,
                    sgst_return: allGST.return.sgst,
                    cgst_return: allGST.return.cgst,
                    igst_return: allGST.return.igst,
                    onward_markup: 0,
                    return_markup: 0,
                    markup_charges: 0,
                    other_taxes: 0,
                    taxable_fare : taxable.onward + taxable.return,
                    vendor: {
                        service_charges: serviceCharge,
                        GST: allGST.onward.cgst + allGST.return.cgst + allGST.onward.sgst + allGST.return.sgst,
                        CGST : 0,
                        SGST : 0,
                        IGST : allGST.onward.igst + allGST.return.igst
                    }
                },
                onwardfare: [[{
                    FareBasisCode: depfareQuote.FareRules[0].FareBasisCode,
                    IsPriceChanged: depPrice,
                    PassengerCount: depfareQuote.FareBreakdown[0].PassengerCount,
                    PassengerType: depfareQuote.FareBreakdown[0].PassengerCount,
                    basefare: depfareQuote.FareBreakdown[0].BaseFare,
                    details: {
                        AdditionalTxnFeeOfrd: 0,
                        AdditionalTxnFeePub: 0,
                        BaseFare: depfareQuote.FareBreakdown[0].BaseFare,
                        PassengerCount: depfareQuote.FareBreakdown[0].PassengerCount,
                        PassengerType: depfareQuote.FareBreakdown[0].PassengerCount,
                        Tax: depfareQuote.Fare.Tax,
                        TransactionFee: 0,
                        YQTax: depfareQuote.Fare.TaxBreakup[1].value
                    },
                    tax: depfareQuote.Fare.Tax,
                    total_amount: depfareQuote.Fare.PublishedFare,
                    yqtax: depfareQuote.Fare.TaxBreakup[1].value
                }]],
                returnfare: [[{
                    FareBasisCode: refareQuote.FareRules[0].FareBasisCode,
                    IsPriceChanged: rePrice,
                    PassengerCount: refareQuote.FareBreakdown[0].PassengerCount,
                    PassengerType: refareQuote.FareBreakdown[0].PassengerCount,
                    basefare: refareQuote.FareBreakdown[0].BaseFare,
                    details: {
                        AdditionalTxnFeeOfrd: 0,
                        AdditionalTxnFeePub: 0,
                        BaseFare: refareQuote.FareBreakdown[0].BaseFare,
                        PassengerCount: refareQuote.FareBreakdown[0].PassengerCount,
                        PassengerType: refareQuote.FareBreakdown[0].PassengerCount,
                        Tax: refareQuote.Fare.Tax,
                        TransactionFee: 0,
                        YQTax: refareQuote.Fare.TaxBreakup[1].value
                    },
                    tax: refareQuote.Fare.Tax,
                    total_amount: refareQuote.Fare.PublishedFare,
                    yqtax: refareQuote.Fare.TaxBreakup[1].value
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

    bookingPerson() {
      let users = this.store.selectSnapshot(CompanyState.getEmployees);
      let admins = users.filter(user => user.role == 'admin' && user.is_rightsto_book !== null && user.is_rightsto_book);
      return [admins[0].email];
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

    totalSummary(data : flightResult, segment : flightData[][],type : string) : totalsummary[] {

      let serviceCharge : number = this.store.selectSnapshot(FLightBookState.getServiceCharge);
      let gst = type == "onward" ? this.store.selectSnapshot(FLightBookState.getGST).onward : this.store.selectSnapshot(FLightBookState.getGST).return;

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
                  SGST: gst.sgst,
                  CGST: gst.cgst,
                  IGST: gst.igst,
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
                      gst.sgst +
                      gst.cgst +
                      gst.igst),
                  currency: data.FareBreakdown[0].Currency
              }
          }
      );
    }

    bookTicket(states: StateContext<domesticBook> ,rqst : rt_sendRequest,fareIndex : fareRule, type : string) {

      let bkpl: bookpayload = null;
      let openreq = null;
      let bookres = null;
      let segpax = null;

      return from(this.flightService.rtSendRequest(rqst,false))
        .pipe(
          flatMap(
            (response : HTTPResponse) => {

                console.log(response);
                openreq = JSON.parse(response.data).data;
                //open req json
                console.log(JSON.stringify(openreq));
                segpax = this.paxArray(openreq.passenger_details.passenger, type);
                bkpl = {
                    Passengers : segpax,
                    TraceId: fareIndex.TraceId,
                    JourneyType: 1,
                    IsLCC: openreq.passenger_details.flight_details[0].IsLCC,
                    ResultIndex: fareIndex.ResultIndex
                }

                console.log(bkpl);
                console.log(JSON.stringify(bkpl));
                return from(this.flightService.bookFlight(bkpl))
                  .pipe(
                    tap((res) => console.log("bookflight",res)),
                    catchError(error =>  throwError(error))
                  );
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
                        fareQuote_onward: type == "onward" ? states.getState().departure.fareQuote : states.getState().return.fareQuote,
                        fareQuote_return: type == "onward" ? states.getState().return.fareQuote : states.getState().departure.fareQuote
                      }
                  }

                  console.log(JSON.stringify(metrix));
                  return from(this.flightService.metrixboard(metrix))
                  .pipe(
                    tap((res) => console.log("metrixboard",res)),
                    catchError(error =>  throwError(error))
                  );
              }
          ),
          flatMap(
              (response) => {
                  let approveObj = this.approveRequestPayload(states,response,rqst,bookres,openreq,fareIndex,type,"booked","online");
                  console.log(JSON.stringify(approveObj));
                  let bookreq$ = this.approvalService.approvalReq('flight',openreq.id,approveObj);
                  return bookreq$
                  .pipe(
                    tap((res) => console.log("bookflight",res)),
                    catchError(error =>  throwError(error))
                  );
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
                  return this.flightService.bookTicket(ticket)
                  .pipe(
                    tap((res) => console.log("bookticket",res)),
                    catchError(error =>  throwError(error))
                  );
              }
          ),
          map(
              (response) => {
                  console.log(response);
                  let data = JSON.parse(response.data).data;
                  console.log(data);
                  //book ticket json
                  console.log(JSON.stringify(data));
                  this.loadingCtrl.dismiss(null,null,'loading-book');
                  return response
              }
          )
        )
    }

    //approvereq for booking
    approveRequestPayload(states : StateContext<domesticBook>,response,sendReq,bookres,openreq, fr : fareRule, type : string,rqstStatus : string, bookingmode : string) {

      let data = JSON.parse(response.data);
      console.log(data,response);

      //metrix json
      console.log(JSON.stringify(data));
      let pnr = JSON.stringify([bookres.response.Response.PNR.toString()])
      let bookingid = JSON.stringify([bookres.response.Response.BookingId.toString()]);
      console.log(pnr,bookingid);

      let depfareQuote = type == "onward" ?  states.getState().departure.fareQuote :  states.getState().return.fareQuote;
      let refareQuote = type == "onward" ?  states.getState().return.fareQuote :  states.getState().departure.fareQuote;

      let onwardtaxkey = _.keyBy(depfareQuote.Fare.TaxBreakup,(o) => o.key)
      let onwardtaxval = _.mapValues(onwardtaxkey,(o) => o.value);

      let returntaxkey = _.keyBy(refareQuote.Fare.TaxBreakup,(o) => o.key)
      let returntaxval = _.mapValues(returntaxkey,(o) => o.value);

      let uapi_params: rt_uapi_params = {
        selected_plb_Value: {
            K3: onwardtaxval.K3,
            PLB_earned: depfareQuote.Fare.PLBEarned,
            queuenumber: 0,
            PCC: 0,
            consolidator_name: 'ONLINE FARE',
            vendor_id: environment.vendorID

        },
        selected_Return_plb_Value: {
            K3: returntaxval.K3,
            PLB_earned: refareQuote.Fare.PLBEarned,
            queuenumber: 0,
            PCC: 0,
            consolidator_name: 'ONLINE FARE',
            vendor_id: environment.vendorID
        }
      }

      let fairIndex = fr;
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
            uapi_params: uapi_params,
            passenger: this.store.selectSnapshot(FlightPassengerState.getSelectedPassengers),
            fare_response: {
              published_fare: depfareQuote.Fare.PublishedFare +
              this.markupCharges(depfareQuote.Fare.PublishedFare),
              charges_details: sendReq.passenger_details.fare_response.charges_details,
              cancellation_risk: this.store.selectSnapshot(FLightBookState.getRisk)
            },
            flight_details: [depfareQuote,refareQuote],
            country_flag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? 0 :
            this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'international' ? 1 : 0,
            trace_Id: fairIndex.TraceId,
            published_fare: depfareQuote.Fare.PublishedFare +
            this.markupCharges(depfareQuote.Fare.PublishedFare),
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

    paxArray(passenger : flightpassenger[],type : string) {
      let fare = type == "onward" ? this.store.selectSnapshot(FLightBookState.getFare).onward :  this.store.selectSnapshot(FLightBookState.getFare).return;
      return _.chain(passenger)
      .map(((el : flightpassenger) => {
          console.log(el);
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
              Baggage : type == "onward" ? el.onwardExtraServices.Baggage : el.returnExtraServices.Baggage,
              MealDynamic : type == "onward" ? el.onwardExtraServices.Meal : el.returnExtraServices.Meal
          }

          return newel;
      }))
      .value();
    }

    segmentSSR(states : StateContext<domesticBook>, services : meal[] | baggage[] | any[],type : string) {

      let onwardSource = states.getState().departure.fareQuote.Segments[0][0].Origin.Airport.AirportCode;
      let onwardDestiation = _.last(states.getState().departure.fareQuote.Segments[0]).Destination.Airport.AirportCode;

      let onwardSegmentService : servicebySegment[] =  states.getState().departure.fareQuote.Segments[0].map((el) => {
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

      let returnSource = states.getState().return.fareQuote.Segments[0][0].Origin.Airport.AirportCode;
      let returnDestiation = _.last(states.getState().return.fareQuote.Segments[0]).Destination.Airport.AirportCode;

      let returnSegmentService : servicebySegment[] =  states.getState().return.fareQuote.Segments[0].map((el) => {
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
