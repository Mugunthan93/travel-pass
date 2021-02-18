import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { SearchType, SearchMode } from './search.state';
import { JourneyType } from './search/flight.state';
import { MenuController, ModalController } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { of, from, forkJoin } from 'rxjs';
import { BookingService } from "../services/booking/booking.service";
import { HTTPResponse } from "@ionic-native/http/ngx";
import { Injectable } from "@angular/core";

export interface dashboard {
  upcomingTrips: upcomingTrips[],
  upcomingTripObject : any[],
  loading : boolean
}

export interface upcomingTrips {
    type : string
    from: string
    to: string
    date : string
    ticket : string[]
    journey : number
    id : number
    travel_date? : string
}

export class GetDashboard{
    static readonly type = '[Dashboard] GetDashboard';
}

export class SearchFlight{
    static readonly type = '[Dashboard] SearchFlight';
    constructor() {

    }
}

export class SearchBus {
    static readonly type = '[Dashboard] SearchBus';
    constructor() {

    }
}

export class SearchHotel {
    static readonly type = '[Dashboard] SearchHotel';
    constructor() {

    }
}

export class SearchTrain {
    static readonly type = '[Dashboard] SearchTrain';
    constructor() {

    }
}

export class UpcomingTrips {
    static readonly type = '[Dashboard] UpcomingTrips';
    constructor() {

    }
}

export class AllUpcomingTrips {
  static readonly type = '[Dashboard] AllUpcomingTrips';
  constructor() {

  }
}


@State<dashboard>({
  name: "Dashboard",
  defaults: {
    upcomingTrips: [],
    upcomingTripObject : [],
    loading : false
  },
})

@Injectable()
export class DashboardState {

  constructor(
    private store: Store,
    private sharedService: SharedService,
    public modalCtrl : ModalController,
    public bookingService : BookingService
  ) {}

  @Selector()
  static getUpcomingTrips(state: dashboard) : upcomingTrips[] {
    return state.upcomingTrips;
  }

  @Selector()
  static getUpcomingTripsObject(state: dashboard) : any[] {
    return state.upcomingTripObject;
  }

  @Selector()
  static getLoading(state: dashboard) : boolean {
    return state.loading;
  }

  @Action(GetDashboard)
  getDashboard() {
    this.store.dispatch(new Navigate(["/", "home", "dashboard", "home-tab"]));
  }

  @Action(SearchFlight)
  searchFlight() {
    this.store.dispatch(new SearchMode("flight"));
    this.store.dispatch(new SearchType("one-way"));
    this.store.dispatch(new JourneyType("one-way"));
    this.store.dispatch(
      new Navigate(["/", "home", "search", "flight", "one-way"])
    );
  }

  @Action(SearchBus)
  searchBus() {
    this.store.dispatch(new SearchMode("bus"));
    this.store.dispatch(new Navigate(["/", "home", "search", "bus"]));
  }

  @Action(SearchHotel)
  searchHotel() {
    this.store.dispatch(new SearchMode("hotel"));
    this.store.dispatch(new SearchType("one-way"));
    this.store.dispatch(new Navigate(["/", "home", "search", "hotel"]));
  }

  @Action(SearchTrain)
  searchTrain() {
    this.store.dispatch(new SearchMode("train"));
    this.store.dispatch(new SearchType("one-way"));
    this.store.dispatch(
      new Navigate(["/", "home", "search", "train", "one-way"])
    );
  }

  @Action(UpcomingTrips)
  async upcomingTrips(states: StateContext<any>) {
    try {
      const upcomingTripsResponse = await this.sharedService.upcomingTrips();
      let response = JSON.parse(upcomingTripsResponse.data);

      console.log(response);

      let partition = _.partition(response.data, (el) => {
        return moment({}).isBefore(el.travel_date);
      });
      partition[0] = partition[0].sort((a, b) => {
        if (moment(b.travel_date).isAfter(a.travel_date)) {
          return -1;
        } else if (moment(b.travel_date).isBefore(a.travel_date)) {
          return 1;
        } else {
          return 0;
        }
      });

      let totalResponse: any[] = partition[0].concat(partition[1]);

      states.patchState({
        upcomingTrips: this.tripResponse(totalResponse),
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  tripResponse(data: any[]) : upcomingTrips[] {
    return data.map(
      (trip) => {
        if(trip.hasOwnProperty('trip_requests')) {
          let lastTrip = trip.passenger_details.flight_details[0].Segments.length - 1;
          let lastFlight = trip.passenger_details.flight_details[0].Segments[lastTrip].length - 1;
          let lastdetail = trip.passenger_details.flight_details.length - 1;

          let lastsegment =  trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight-1];
          let rescheduledTrip = _.isNull(lastsegment) ?  trip.passenger_details.flight_details[lastdetail].Segments[lastTrip][lastFlight-1].Destination.Airport.CityCode : trip.passenger_details.flight_details[0].Segments[0][0].Destination.Airport.CityCode;

          return {
            type : 'flight',
            from: trip.passenger_details.flight_details[0].Segments[0][0].Origin.Airport.CityCode,
            to: rescheduledTrip,
            date: trip.passenger_details.flight_details[0].Segments[0][0].Origin.DepTime,
            ticket : trip.passenger_details.PNR,
            journey : trip.trip_requests.JourneyType,
            id : trip.id
          }
        }
        else if(trip.hasOwnProperty('hotel_requests')) {
          let req = typeof trip.guest_details == 'string' ? JSON.parse(trip.guest_details) : trip.guest_details;
          return {
            type : 'hotel',
            from: moment(req.basiscInfo.CheckInDate).utc().format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            to: moment(req.basiscInfo.CheckOutDate).utc().format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            date: _.upperCase(req.basiscInfo.HotelName) + '-' + _.upperCase(req.basiscInfo.HotelAddress),
            ticket : [],
            journey : null,
            id : trip.id
          }
        }
        else if(trip.hasOwnProperty('bus_requests')) {
          console.log(trip.passenger_details);
          return {
            type : 'bus',
            from: trip.passenger_details.bookedDetails.sourceCity,
            to: trip.passenger_details.bookedDetails.destinationCity,
            date: moment(trip.passenger_details.bookedDetails.bookingDate).utc().format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            ticket : [trip.passenger_details.bookedDetails.opPNR],
            journey : 1,
            id : trip.id
          }
        }
        else if(trip.hasOwnProperty('train_requests')) {
          console.log(trip);
          let lastTrip =  trip.passenger_details.trainDetails.length - 1;
          return {
            type : 'train',
            from: trip.passenger_details.trainDetails[0].OriginName,
            to: trip.passenger_details.trainDetails[lastTrip].DestinationName,
            date: moment(trip.passenger_details.trainDetails[0].depDate).utc().format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            ticket : trip.passenger_details.trainDetails.map((el) => {
              return el.bookedResponse ? el.bookedResponse.PNR : [];
            }),
            journey : trip.train_requests.JourneyType,
            id : trip.id
          }
        }
      }
    );
  }

  @Action(AllUpcomingTrips)
  allUpcomingTrips(states : StateContext<dashboard>) {

    states.patchState({
      upcomingTripObject : [],
      upcomingTrips : [],
      loading : true
    });


    let type$ = from(['flight','hotel','bus','train']);
    let mode$ = from(['online','offline']);

    return mode$
      .pipe(
        mergeMap(
          (mode) => {
            return type$
              .pipe(
                mergeMap(
                  (type) => {
                    let bookedTrips$ = this.bookingService.myBooking(type,'booked',mode);
                    let rescheduledTrips$ = this.bookingService.myBooking(type,'rescheduled',mode);

                    return forkJoin([bookedTrips$,rescheduledTrips$])
                      .pipe(
                        map(
                          (response) => {
                            let data = _.flatMap(this.bookingData(response))
                            let upcoming = data.filter(el => {
                              if(_.isUndefined(el.travel_date) || _.isNull(el.travel_date)) {
                                return false;
                              }
                              else {
                                console.log(el.travel_date,moment({}).isBefore(moment(el.travel_date)));
                                return moment({}).isBefore(moment(el.travel_date),'day');
                              }
                            });
                            console.log(upcoming);
                            return upcoming;
                          }
                        )
                      );
                  }
                ),
                toArray()
              )
          }
        ),
        toArray(),
        map(
          (response) => {
            let allupcomingTrips = _.flattenDeep(response);
            let upcoming = _.chain(this.tripResponse(allupcomingTrips))
              .filter(el => !(el.date == 'Invalid date' || _.isUndefined(el.from) || _.isUndefined(el.to) || el.ticket.length == 0))
              .sortBy(el => moment(el.date).isValid ? el.date : el.from)
              .value();
            console.log(allupcomingTrips,upcoming);
            states.patchState({
              upcomingTrips : upcoming,
              upcomingTripObject : allupcomingTrips,
              loading : false
            });
          }
        )
      );

  }

  bookingData(data : HTTPResponse[]) {
    return data.map(
        (el) => {
            return _.isUndefined(JSON.parse(el.data).data) ? [] : JSON.parse(el.data).data;
        }
    );
}


}
