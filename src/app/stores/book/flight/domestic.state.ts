import { Selector, Action, State, Store, StateContext } from '@ngxs/store';
import { flightResult, flightData } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { bookObj, value, FLightBookState, rt_uapi_params, rt_sendRequest, rt_kioskRequest, SetFare, SetMeal, SetBaggage, taxes, plb, totalsummary, SetServiceCharge, GetPLB, SetTaxable, SetGST, baggage, meal } from '../flight.state';
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
import { FlightPassengerState, SetFirstPassengers } from '../../passenger/flight.passenger.states';
import { AgencyState } from '../../agency.state';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { concat, empty, forkJoin, from, iif, of, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { patch } from '@ngxs/store/operators';

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

    @Selector()
    static getTotalFare(states: domesticBook) : number {
        return states.departure.flight.summary.total.reduce((acc,curr) => acc + curr.total,0) + states.return.flight.summary.total.reduce((acc,curr) => acc + curr.total,0);
    }

    @Action(GetFareQuoteSSR)
    getFareQuoteSSR(states: StateContext<domesticBook>) {

        let depFQ = null;
        let depPriceChange = false;
        let depSSR : SSR = null;
        let reFQ = null;
        let rePriceChange = false;
        let reSSR : SSR = null;

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

                                        return states.getState().departure.fareQuote.Segments.map((el) => {
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


                                        return states.getState().departure.fareQuote.Segments.map((el) => {
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


                                        return states.getState().departure.fareQuote.Segments.map((el) => {
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

                                          return states.getState().return.fareQuote.Segments.map((el) => {
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


                                          return states.getState().return.fareQuote.Segments.map((el) => {
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


                                          return states.getState().return.fareQuote.Segments.map((el) => {
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

        // try {
        //     const departureFQResponse = await this.flightService.fairQuote(this.store.selectSnapshot(DomesticResultState.getSelectedDepartureFlight).fareRule);
        //     const returnFQResponse = await this.flightService.fairQuote(this.store.selectSnapshot(DomesticResultState.getSelectedReturnFlight).fareRule);
        //     console.log(departureFQResponse, returnFQResponse);
        //     if (departureFQResponse.status == 200 && returnFQResponse.status == 200) {
        //         let depResponse = JSON.parse(departureFQResponse.data).response;
        //         let reResponse = JSON.parse(returnFQResponse.data).response;
        //         console.log(depResponse, reResponse);
        //         if (depResponse.Results && reResponse.Results) {

        //             let taxkey = _.keyBy(depResponse.Results.Fare.TaxBreakup,(o) => {
        //                 console.log(o);
        //                 return o.key;
        //             })

        //             console.log(taxkey);
        //             let taxval = _.mapValues(taxkey,(o) => o.value);
        //             console.log(taxval);

        //             depFQ = depResponse.Results;
        //             depPriceChange = depResponse.IsPriceChanged;
        //             reFQ = reResponse.Results;
        //             rePriceChange = reResponse.IsPriceChanged;

        //             let gstapplied = this.store.selectSnapshot(AgencyState.getGstApplied);
        //             let plb = this.store.selectSnapshot(FLightBookState.getPLB)[0];
        //             let basefare = depResponse.Results.Fare.BaseFare;
        //             let yq = (taxval as taxes).YQTax;
        //             let paxcount = this.store.selectSnapshot(RoundTripSearchState.getAdult)

        //             states.patchState({
        //                 departure: {
        //                     fareQuote: depFQ,
        //                     isPriceChanged: depPriceChange,
        //                     ssr: depSSR,
        //                     flight: this.domesticbookData(depFQ, gstapplied,plb,basefare,yq,paxcount)
        //                 },
        //                 return: {
        //                     fareQuote: reFQ,
        //                     isPriceChanged: rePriceChange,
        //                     ssr: reSSR,
        //                     flight: this.domesticbookData(reFQ, gstapplied,plb,basefare,yq,paxcount)
        //                 }
        //             });


        //         }
        //         else if (depResponse.Error.ErrorCode == 2 || reResponse.Error.ErrorCode == 2) {
        //             console.log(depResponse.Error.ErrorMessage);
        //             loading.dismiss();
        //             this.store.dispatch(new RoundTripSearch());
        //             return;
        //         }
        //         else if (depResponse.Error.ErrorCode == 6 || reResponse.Error.ErrorCode == 6) {
        //             console.log(depResponse.Error.ErrorMessage);
        //             loading.dismiss();
        //             this.store.dispatch(new RoundTripSearch());
        //             return;
        //         }
        //     }
        // }
        // catch (error) {
        //     console.log(error);
        //     if (error.status == -4) {
        //         loading.dismiss();
        //         failedAlert.message = "Timeout, Try Again";
        //         return;
        //     }
        // }

        // try {
        //     const departureSSRResponse = await this.flightService.SSR(this.store.selectSnapshot(DomesticResultState.getSelectedDepartureFlight).fareRule);
        //     const returnSSRResponse = await this.flightService.SSR(this.store.selectSnapshot(DomesticResultState.getSelectedReturnFlight).fareRule);
        //     console.log(departureSSRResponse, returnSSRResponse);
        //     if (departureSSRResponse.status == 200 && returnSSRResponse.status == 200) {
        //         depSSR = JSON.parse(departureSSRResponse.data).response;
        //         reSSR = JSON.parse(returnSSRResponse.data).response;
        //         console.log(depSSR, reSSR);

        //         states.patchState({
        //             departure: {
        //                 fareQuote: states.getState().departure.fareQuote,
        //                 isPriceChanged: states.getState().departure.isPriceChanged,
        //                 ssr: depSSR,
        //                 flight: states.getState().departure.flight
        //             },
        //             return: {
        //                 fareQuote: states.getState().return.fareQuote,
        //                 isPriceChanged: states.getState().return.isPriceChanged,
        //                 ssr: reSSR,
        //                 flight: states.getState().return.flight
        //             }
        //         });

        //         this.store.dispatch(new SetMeal(depSSR.MealDynamic, reSSR.MealDynamic));
        //         this.store.dispatch(new SetBaggage(depSSR.Baggage, reSSR.Baggage));

        //         if (depSSR.MealDynamic) {
        //             this.store.dispatch(new SetMeal(depSSR.MealDynamic, reSSR.MealDynamic));
        //         }
        //         else if (depSSR.Meal) {
        //             this.store.dispatch(new SetMeal(depSSR.Meal, reSSR.Meal));
        //         }

        //         if (depSSR.Baggage) {
        //             this.store.dispatch(new SetBaggage(depSSR.Baggage, reSSR.Baggage));
        //         }
        //     }
        // }
        // catch (error) {
        //     console.log(error);
        //     if (error.status == -4) {
        //         loading.dismiss();
        //         failedAlert.message = "Timeout, Try Again";
        //         return;
        //     }
        // }

        // states.dispatch(new SetFare(states.getState().departure.fareQuote.Fare, states.getState().return.fareQuote.Fare));
        // states.dispatch(new SetFirstPassengers());
        // states.dispatch(new BookMode('flight'));
        // states.dispatch(new BookType('animated-round-trip'));
        // states.dispatch(new Navigate(['/', 'home', 'book', 'flight', 'round-trip','domestic']));
        // loading.dismiss();
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

        let sendReq: rt_sendRequest = this.sendRequestPayload(states,action);

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
    sendRequestPayload(states : StateContext<domesticBook>,action : DomesticSendRequest | DomesticTicket) {

      let allGST : { onward : GST, return : GST } = this.store.selectSnapshot(FLightBookState.getGST);
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

      let onwardfarequote = states.getState().departure.fareQuote
      let onwardtaxkey = _.keyBy(onwardfarequote.Fare.TaxBreakup,(o) => o.key)
      let onwardtaxval = _.mapValues(onwardtaxkey,(o) => o.value);

      let returnfarequote = states.getState().return.fareQuote
      let returntaxkey = _.keyBy(returnfarequote.Fare.TaxBreakup,(o) => o.key)
      let returntaxval = _.mapValues(returntaxkey,(o) => o.value);

      let uapi_params: rt_uapi_params = {
        selected_plb_Value: {
            K3: onwardtaxval.K3,
            PLB_earned: states.getState().departure.fareQuote.Fare.PLBEarned,
            queuenumber: 0,
            PCC: 0,
            consolidator_name: 'ONLINE FARE',
            vendor_id: environment.vendorID

        },
        selected_Return_plb_Value: {
            K3: returntaxval.K3,
            PLB_earned: states.getState().return.fareQuote.Fare.PLBEarned,
            queuenumber: 0,
            PCC: 0,
            consolidator_name: 'ONLINE FARE',
            vendor_id: environment.vendorID
        }
    }

    let published_fare = (
      states.getState().departure.fareQuote.Fare.PublishedFare +
      this.markupCharges(states.getState().departure.fareQuote.Fare.PublishedFare) +
      states.getState().departure.fareQuote.Fare.OtherCharges +
      serviceCharge +
      allGST.onward.sgst +
      allGST.onward.cgst +
      allGST.onward.igst
      ) + (
      states.getState().return.fareQuote.Fare.PublishedFare +
      this.markupCharges(states.getState().return.fareQuote.Fare.PublishedFare) +
      states.getState().return.fareQuote.Fare.OtherCharges +
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
            flight_details: [states.getState().departure.fareQuote, states.getState().return.fareQuote],
            fareQuoteResults: [states.getState().departure.fareQuote, states.getState().return.fareQuote],
            country_flag: this.store.selectSnapshot(RoundTripSearchState.getTripType) == 'domestic' ? "0" : "1",
            user_eligibility: {
                approverid: "airline",
                msg: null,
                company_type: "corporate"
            },
            published_fare: (states.getState().departure.fareQuote.Fare.PublishedFare - states.getState().departure.fareQuote.Fare.TaxBreakup[0].value) +
            this.markupCharges(states.getState().departure.fareQuote.Fare.PublishedFare) +
            (states.getState().return.fareQuote.Fare.PublishedFare - states.getState().return.fareQuote.Fare.TaxBreakup[0].value) +
            this.markupCharges(states.getState().return.fareQuote.Fare.PublishedFare),
            uapi_params: uapi_params,
            fare_response: {
                published_fare: (states.getState().departure.fareQuote.Fare.PublishedFare - states.getState().departure.fareQuote.Fare.TaxBreakup[0].value) +
                this.markupCharges(states.getState().departure.fareQuote.Fare.PublishedFare) +
                (states.getState().return.fareQuote.Fare.PublishedFare - states.getState().return.fareQuote.Fare.TaxBreakup[0].value) +
                this.markupCharges(states.getState().return.fareQuote.Fare.PublishedFare),
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
        managers :manager,
        approval_mail_cc: action.mailCC,
        purpose: action.purpose,
        comments: '[\"' + action.comment + '\"]',
        booking_mode : "online",
        status : "pending",
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
}
