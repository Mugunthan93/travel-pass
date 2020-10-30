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
  upcomingTrips: upcomingTrips[];
  projectList: projectList[];
}

export interface upcomingTrips {
    from: string,
    to: string,
    travelStartDate: string
}

export interface projectList {
  company_id: number;
  createdAt: any;
  id: number;
  project_name: string;
  updatedAt: any;
}

export interface trippayload {
    e_flag: number
    endCity: string
    endDate: string
    manager_approval: number
    manager_id: number
    project_id: number
    startCity: string
    startDate: string
    status: string
    travelled_by: number
    trip_name: number
}

export interface flightexpensepayload {
  accounts_approval: any;
  approved_accounts: any;
  approved_manager: any;
  attachementpath: { bills: [] };
  cost: number
  eligible_amount: number
  end_city: string
  end_date: string
  manager_approval: any
  no_of_days: number
  paid_by: string
  start_city: string
  start_date: string
  status: string
  trip_id: number
  type: string
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

export class GetProjectList {
  static readonly type = "[Dashboard] GetProjectList";
  constructor(public modal: HTMLIonModalElement) {}
}

export class AddNewTrip {
    static readonly type = '[Dashboard] AddNewTrip';
    constructor(public trip : trippayload) {

    }
}


@State<dashboard>({
  name: "Dashboard",
  defaults: {
    upcomingTrips: [],
    projectList: [],
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

  @Selector()
  static getProjectList(state: dashboard): projectList[] {
    return state.projectList;
  }

  @Action(GetDashboard)
  getDashboard(states: StateContext<any>, action: SearchFlight) {
    this.menuCtrl.close("first");
    this.store.dispatch(new Navigate(["/", "home", "dashboard", "home-tab"]));
  }

  @Action(SearchFlight)
  searchFlight(states: StateContext<any>, action: SearchFlight) {
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
  async upcomingTrips(states: StateContext<any>, action: UpcomingTrips) {
    try {
      const upcomingTripsResponse = await this.sharedService.upcomingTrips();
      let response = JSON.parse(upcomingTripsResponse.data);

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
    data.forEach((element, index, array) => {
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

  @Action(GetProjectList)
  getProjectList(states: StateContext<any>, action: GetProjectList) {
    let companyId$ = this.store.select(UserState.getcompanyId);

    return companyId$.pipe(
      flatMap((id) => {
        let project$ = this.sharedService.getProjectList(id);
        return project$;
      }),
      flatMap((response) => {
        console.log(response);
        let list: projectList[] = JSON.parse(response.data).data;
        states.patchState({
          projectList: list,
        });

        return from(action.modal.present());
      })
    );
  }

  @Action(AddNewTrip)
  addNewTrip(states: StateContext<any>, action: AddNewTrip) {
    let payload: trippayload = Object.assign({}, action.trip);
    
    let createTrip$ = this.sharedService.createTrip(payload);
    let tripId: number = null;

    return createTrip$
      .pipe(
        flatMap(
          (response) => {
            console.log(response);
            if (response.status == 200) {
              let start = payload.startDate;
              let end = payload.endDate;
              tripId = JSON.parse(response.data).id;
              let flightTrips$ = this.sharedService.GetFlightTrip(start, end);
              return flightTrips$;
            }
          }
        ),
        flatMap(
          (response) => {
            console.log(response);
            if (response.status == 200) {
              let flightArray = JSON.parse(response.data).data;
              return from(flightArray)
            }
          }
        ),
        mergeMap(
          (flightsTrip: any) => {
            console.log(flightsTrip);
            let payload: flightexpensepayload = {
              accounts_approval: null,
              approved_accounts: null,
              approved_manager: null,
              attachementpath: {bills: []},
              cost: flightsTrip.passenger_details.fare_response.published_fare,
              eligible_amount: 0,
              end_city: flightsTrip.trip_requests.Segments[0].DestinationName,
              end_date: flightsTrip.trip_requests.Segments[0].PreferredArrivalTime,
              manager_approval: null,
              no_of_days: moment(flightsTrip.trip_requests.Segments[0].PreferredArrivalTime).diff(flightsTrip.trip_requests.Segments[0].PreferredDepartureTime,'days'),
              paid_by: "paid_company",
              start_city: flightsTrip.trip_requests.Segments[0].OriginName,
              start_date: flightsTrip.trip_requests.Segments[0].PreferredDepartureTime,
              status: "new",
              trip_id: tripId,
              type: "flight"
            }

            let expense$ = this.sharedService.createExpense(payload);
            return expense$;
          }
        ),
        toArray(),
        flatMap(
          (response) => {
            console.log(response);
            payload.e_flag = 1;
            let editTrip$ = this.sharedService.editTrip(tripId, payload);
            return editTrip$;
          }
        ),
        flatMap(
          (response) => {
            console.log(response);
            return from(this.modalCtrl.dismiss(null,null,'trip'));
          }
        )
      );
  }
}