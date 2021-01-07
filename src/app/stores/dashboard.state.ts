import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { SearchType, SearchMode } from './search.state';
import { JourneyType } from './search/flight.state';
import { MenuController, ModalController } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CompanyState } from './company.state';
import { UserState } from './user.state';
import { map, flatMap, mergeMap, toArray } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { TripComponent } from '../components/expense/trip/trip.component';

export interface dashboard {
  upcomingTrips: upcomingTrips[]
}

export interface upcomingTrips {
    from: string,
    to: string,
    travelStartDate: string
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


@State<dashboard>({
  name: "Dashboard",
  defaults: {
    upcomingTrips: []
  },
})
export class DashboardState {
  constructor(
    private store: Store,
    public menuCtrl: MenuController,
    private sharedService: SharedService,
    public modalCtrl : ModalController
  ) {}

  @Selector()
  static getUpcomingTrips(state: dashboard) {
    return state.upcomingTrips;
  }

  @Action(GetDashboard)
  getDashboard() {
    this.menuCtrl.close("first");
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

  tripResponse(data: any[]) {
    let trip: upcomingTrips[] = [];
    data.forEach((element, index) => {
      let lastTrip =
        element.passenger_details.flight_details[0].Segments.length - 1;
      let lastFlight =
        element.passenger_details.flight_details[0].Segments[lastTrip].length -
        1;

      trip[index] = {
        from:
          element.passenger_details.flight_details[0].Segments[0][0].Origin
            .Airport.CityCode,
        to:
          element.passenger_details.flight_details[0].Segments[lastTrip][
            lastFlight
          ].Destination.Airport.CityCode,
        travelStartDate:
          element.passenger_details.flight_details[0].Segments[0][0].Origin
            .DepTime,
      };
    });
    return trip;
  }
}