import { ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Action, NgxsOnChanges, NgxsSimpleChange, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import { combineLatest, concat, from, of } from 'rxjs';
import { finalize, flatMap, map, mergeMap, toArray, withLatestFrom } from 'rxjs/operators';
import { ExpenseService } from '../services/expense/expense.service';
import { UserState } from './user.state';
import * as _ from 'lodash';
import { tripList } from '../components/trip-list/trip-list.component';

export interface expense {
    trips : triplist[],
    expenses : any[],
    startdate : moment.Moment
    enddate: moment.Moment
    projectList: []
    loading : boolean
    currentTrip : triplist
}

export interface triplist {
    createdAt: string
    e_flag: number
    endCity: string
    endDate: string
    id: number
    manager_approval: number
    manager_id: number
    project_id: number
    startCity: string
    startDate: string
    status: string
    travelled_by: number
    trip_name: string
    updatedAt: string
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
    manager_approval : any
    no_of_days: number
    paid_by: string
    start_city: string
    start_date: string
    status: string
    trip_id: number
    type: string
}

export interface expenselist {
    accounts_approval: any
    approved_accounts: any
    approved_manager: any
    attachementpath: {
        bills: any[]
    }
    cost: number
    createdAt: string
    eligible_amount: number
    end_city: string
    end_date: string
    id: number
    local_travel_value: any
    manager_approval: any
    no_of_days: number
    paid_by: string
    start_city: string
    start_date: string
    status: string
    trip_id: number
    type: string
    travel_type: any
    updatedAt: string
}

export class ChangeStartDate {
    static readonly type = "[expense] ChangeStartDate";
    constructor(public date : moment.Moment) {

    }
}

export class ChangeEndDate {
    static readonly type = "[expense] ChangeEndDate";
    constructor(public date : moment.Moment) {

    }
}

export class GetTripList {
    static readonly type = "[expense] GetTripList";

}

export class GetExpenseList {
    static readonly type = "[expense] GetExpenseList";
    constructor(public trip : triplist) {

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


@State<expense>({
    name: 'expense',
    defaults: {
        trips : [],
        expenses : [],
        enddate: moment({}).subtract(1, "months"),
        startdate :  moment({}),
        projectList : [],
        loading : false,
        currentTrip : null
    }
})

export class ExpenseState implements NgxsOnChanges {

    constructor(
        private store : Store,
        private expenseService : ExpenseService,
        public modalCtrl : ModalController
    ) {

    }
    ngxsOnChanges(change: NgxsSimpleChange<any>): void {
    }

    
  @Selector()
  static getProjectList(state: expense): projectList[] {
    return state.projectList;
  }

    @Selector()
    static getTripList(state : expense) : triplist[] | number[] {
        return state.trips.length == 0 ? [1,2,3,4,5,6,7,8,9,0] : state.trips;
    }

    @Selector()
    static getExpenseList(state : expense) : expenselist[] {
        return state.expenses;
    }

    @Selector()
    static getStartDate(state : expense) : moment.Moment {
        return state.startdate;
    }

    @Selector()
    static getEndDate(state : expense) : moment.Moment {
        return state.enddate;
    }

    @Selector()
    static getLoading(state : expense) : boolean {
      return state.loading;
    }

    @Selector()
    static getTripDates(state : expense) : any[] {
      let total_trip = state.trips.reduce(
        (acc,curr) => {
           let currentrip = {
            startDate : curr.startDate,
            endDate : curr.endDate
          };
          acc.push(currentrip);
          console.log(acc);
          return acc;
        },[]
      );

      console.log(total_trip);
      return total_trip;
    }

    @Selector()
    static getCurrentTrip (state : expense) : triplist {
      return state.currentTrip;
    }

    @Action(GetTripList, { cancelUncompleted : true })
    getTripList(states : StateContext<expense>) {

        states.patchState({
            trips : [],
            expenses : [],
            loading : true
        });

        let startDate$ = of(states.getState().startdate);
        let endDate$ = of(states.getState().enddate);

        return this.store.select(UserState.getUserId)
            .pipe(
                withLatestFrom(startDate$,endDate$),
                flatMap(
                    (dates) => {
                        let tripList$ = this.expenseService.getTripList(dates[0],dates[1],dates[2]);
                        return tripList$;
                    }
                ),
                flatMap(
                  (response) => {
                      console.log(response);
                      let data : triplist[] = JSON.parse(response.data);
                      states.patchState({
                        trips : data
                      });
                      return from(data)
                        .pipe(
                          mergeMap(
                            (trip : triplist) => {
                              return this.expenseService.getExpenseList(trip.id);
                            }
                          ),
                          toArray()
                        );
                  }
                ),
                flatMap(
                  (response) => {
                      console.log(response);

                      response.forEach(
                        (res) => {
                          if(res.status == 200) {
                              let data : expenselist[] = JSON.parse(res.data);
                              let currentexpense : expenselist[] = Object.assign(states.getState().expenses);
                              let finalexpenses : expenselist[] = currentexpense.concat(data);
                              states.patchState({
                                  expenses : finalexpenses
                              });
                          }
                        }
                      );

                      states.patchState({
                        loading : false
                      });

                      return of(true);
                  }
                )
            );


    }

    @Action(GetExpenseList)
    getExpenseList(states : StateContext<expense>,action : GetExpenseList) {
      
      states.patchState({
        currentTrip : action.trip
      });

      states.dispatch(new Navigate(['/','home','expense-list']));

    }
    
    @Action(ChangeStartDate)
    changeStart(states : StateContext<expense>,action : ChangeStartDate) {
        states.patchState({
            startdate : action.date
        });
    }

    @Action(ChangeEndDate)
    changeEnd(states : StateContext<expense>,action : ChangeEndDate) {
        states.patchState({
            enddate : action.date
        });
    }

    @Action(GetProjectList)
    getProjectList(states: StateContext<any>, action: GetProjectList) {
      let companyId$ = this.store.select(UserState.getcompanyId);
  
      return companyId$.pipe(
        flatMap((id) => {
          let project$ = this.expenseService.getProjectList(id);
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
      
      let createTrip$ = this.expenseService.createTrip(payload);
      let tripId: number = null;
  
      return createTrip$
        .pipe(
          flatMap(
            (response) => {
              console.log(response);
              console.log(JSON.parse(response.data));
              let userId : number = this.store.selectSnapshot(UserState.getUserId);

              if (response.status == 200) {
                let start = moment(payload.startDate);
                let end = moment(payload.endDate);
                tripId = JSON.parse(response.data).id;
                let flightTrips$ = this.expenseService.airlineTrips(userId,start, end);
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
  
              let expense$ = this.expenseService.createExpense(payload);
              return expense$;
            }
          ),
          toArray(),
          flatMap(
            (response) => {
              console.log(response);
              payload.e_flag = 1;
              let editTrip$ = this.expenseService.editTrip(tripId, payload);
              return editTrip$;
            }
          ),
          flatMap(
            (response) => {
              console.log(response);
              return concat(states.dispatch(new GetTripList()),from(this.modalCtrl.dismiss(null,null,'trip')));
            }
          )
        );
    }


    
}