import { ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Action, NgxsOnChanges, NgxsSimpleChange, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import { concat, forkJoin, from, merge, Observable, of, throwError } from 'rxjs';
import { flatMap, mergeMap, toArray, withLatestFrom, first, map, concatMap, catchError } from 'rxjs/operators';
import { ExpenseService } from '../services/expense/expense.service';
import { UserState } from './user.state';
import * as _ from 'lodash';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { EligibilityState } from './eligibility.state';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileTransferError, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { environment } from 'src/environments/environment';


export interface expense {
    trips : triplist[],
    approvalTrip : triplist[],
    expenses : any[],
    approveExpenses : any[];
    startdate : moment.Moment
    enddate: moment.Moment
    projectList: []
    loading : boolean
    currentTrip : triplist
    tripType : string
    expenseSelect: boolean
    sendExp: expenselist[]
    bill: bill[]
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
  
  export interface expensepayload {
    accounts_approval: any;
    approved_accounts: any;
    approved_manager: any;
    attachementpath: bills;
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
    travel_type: string
    trip_id: number
    type: string
}

export interface bill {
  name: string
  size: number
  type: string
  uploaded: boolean
}

export interface bills {
  bills : bill[]
}


export interface expenselist {
    accounts_approval: any
    approved_accounts: any
    approved_manager: any
    attachementpath: bills
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
    static readonly type = "[expense] GetProjectList";
    constructor(public modal: HTMLIonModalElement) {}
}

export class AddNewTrip {
    static readonly type = '[expense] AddNewTrip';
    constructor(public trip : trippayload) {

    }
}

export class UploadBill {
  static readonly type = '[expense] UploadBill';
}

export class AddExpense {
  static readonly type = "[expense] AddExpense";
  constructor(public expense: expensepayload) {

  }
}

export class EditExpense {
  static readonly type = "[expense] EditExpense";
  constructor(public expense: expenselist) {

  }
}

export class ChangeTripType {
  static readonly type = "[expense] ChangeTripType";
  constructor(public type: string) {

  }
}

export class SelectState {
  static readonly type = "[expense] SelectState";
  constructor(public state: boolean) {

  }
}

export class DeleteExpense {
  static readonly type = "[expense] DeleteExpense";
  constructor(public exp: number[]) {

  }
}

export class SendExpense {
  static readonly type = "[expense] SendExpense";
  constructor(public status: string) {

  }
}

export class SelectExpense {
  static readonly type = "[expense] SelectExpense";
  constructor(public exp: expenselist) {

  }
}

export class DeselectExpense {
  static readonly type = "[expense] DeselectExpense";
  constructor(public exp: expenselist) {

  }
}

@State<expense>({
  name: "expense",
  defaults: {
    trips: [],
    approvalTrip : [],
    expenses: [],
    approveExpenses : [],
    enddate: moment({}).subtract(1, "month"),
    startdate: moment({}),
    projectList: [],
    loading: false,
    currentTrip: null,
    tripType : 'mytrips',
    expenseSelect : false,
    sendExp : [],
    bill : []
  },
})

export class ExpenseState implements NgxsOnChanges {

  constructor(
    private store: Store,
    private expenseService: ExpenseService,
    public modalCtrl: ModalController,
    private fileChooser : FileChooser,
    private filePath : FilePath,
    private fileTransfer : FileTransfer,
    private file : File
  ) {}

  ngxsOnChanges(change: NgxsSimpleChange<any>): void {
    console.log(change);
  }

  @Selector()
  static getProjectList(state: expense): projectList[] {
    return state.projectList;
  }

  @Selector()
  static getTripList(state: expense): triplist[] | number[] {
    if(state.tripType == 'mytrips') {
      return (state.trips.length == 0 && state.loading)
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
      : state.trips;
    }
    else if(state.tripType == 'approvaltrips') {
      return (state.approvalTrip.length == 0 && state.loading)
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
      : state.approvalTrip;
    }
  }

  @Selector()
  static getExpenseList(state: expense): expenselist[] {
    if(state.tripType == 'mytrips') {
      return state.expenses;
    }
    else if(state.tripType == 'approvaltrips') {
      return state.approveExpenses;
    }
  }

  @Selector()
  static getStartDate(state: expense): moment.Moment {
    return state.startdate;
  }

  @Selector()
  static getEndDate(state: expense): moment.Moment {
    return state.enddate;
  }

  @Selector()
  static getLoading(state: expense): boolean {
    return state.loading;
  }

  @Selector()
  static getTripDates(state: expense): any[] {
    let total_trip = state.trips.reduce((acc, curr) => {
      let currentrip = {
        startDate: curr.startDate,
        endDate: curr.endDate,
      };
      acc.push(currentrip);
      console.log(acc);
      return acc;
    }, []);

    console.log(total_trip);
    return total_trip;
  }

  @Selector()
  static getExpenseDates(state : expense): any {
    return {
      startDate: state.currentTrip.startDate,
      endDate: state.currentTrip.endDate
    }
  }

  @Selector()
  static getCurrentTrip(state: expense): triplist {
    return state.currentTrip;
  }

  @Selector()
  static getTripType(state: expense): string {
    return state.tripType;
  }

  @Selector()
  static getSelectState(state: expense) : boolean {
    return state.expenseSelect;
  }

  @Selector()
  static SelectDisable(state: expense) : boolean {
    return state.sendExp.length == 0 ? true : false;
  }

  @Selector()
  static getSendExp(state: expense) : expenselist[] {
    return state.sendExp;
  }

  @Selector()
  static getBill(state: expense): bill[] {
    return state.bill;
  }

  @Action(SelectState)
  selectState(states: StateContext<expense>, action : SelectState) {
    states.patchState({
      expenseSelect : action.state
    });
  }

  @Action(ChangeTripType)
  changeTripType(states: StateContext<expense>, action : ChangeTripType) {
    states.patchState({
      tripType : action.type
    });
  }

  @Action(GetTripList, { cancelUncompleted: true })
  getTripList(states: StateContext<expense>) {
    states.patchState({
      trips: [],
      approvalTrip : [],
      expenses: [],
      approveExpenses : [],
      loading: true,
    });

    let startDate$ = of(moment({}));
    let endDate$ = of(moment({}).subtract(1,'month'));

    return this.store.select(UserState.getUserId).pipe(
      withLatestFrom(startDate$, endDate$),
      flatMap((dates) => {

        let tripList$ = this.expenseService.getTripList(
          dates[0],
          dates[1],
          dates[2]
        );

        let approvalList$ = this.expenseService.getApprovalList(
          dates[0],
          dates[1],
          dates[2]
        );

        return forkJoin([tripList$,approvalList$]);
      }),
      flatMap((response) => {

        console.log(response);

        let trip: triplist[] = JSON.parse(response[0].data);
        let approve : triplist[] = JSON.parse(response[1].data);
        states.patchState({
          trips: trip,
          approvalTrip : approve
        });

        let tripExpense$ =  from(trip).pipe(
          mergeMap((trip: triplist) => {
            return this.expenseService.getExpenseList(trip.id);
          }),
          toArray()
        );

        let approveExpense$ = from(approve).pipe(
          mergeMap((trip: triplist) => {
            return this.expenseService.getExpenseList(trip.id);
          }),
          toArray()
        );

        return forkJoin([tripExpense$, approveExpense$]);

      }),
      flatMap((response) => {
        console.log(response);

        response[0].forEach((res) => {
          if (res.status == 200) {
            let data: expenselist[] = JSON.parse(res.data);
            let currentexpense: expenselist[] = Object.assign(
              states.getState().expenses
            );
            let finalexpenses: expenselist[] = currentexpense.concat(data);
            states.patchState({
              expenses: finalexpenses,
            });
          }
        });

        if(response[1].length >= 1) {
          response[1].forEach((res) => {
            if (res.status == 200) {
              let data: expenselist[] = JSON.parse(res.data);
              let currentexpense: expenselist[] = Object.assign(
                states.getState().expenses
              );
              let finalexpenses: expenselist[] = currentexpense.concat(data);
              states.patchState({
                approveExpenses: finalexpenses,
              });
            }
          });
        } 


        states.patchState({
          loading: false,
        });

        return of(true);
      }),
      first()
    );
  }

  @Action(GetExpenseList)
  getExpenseList(states: StateContext<expense>, action: GetExpenseList) {
    states.patchState({
      currentTrip: action.trip,
    });

    states.dispatch(new Navigate(["/", "home", "expense-list"]));
  }

  @Action(ChangeStartDate)
  changeStart(states: StateContext<expense>, action: ChangeStartDate) {
    states.patchState({
      startdate: action.date,
    });
  }

  @Action(ChangeEndDate)
  changeEnd(states: StateContext<expense>, action: ChangeEndDate) {
    states.patchState({
      enddate: action.date,
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

    return createTrip$.pipe(
      flatMap((response) => {
        console.log(response);
        console.log(JSON.parse(response.data));
        let userId: number = this.store.selectSnapshot(UserState.getUserId);

        if (response.status == 200) {
          let start = moment(payload.startDate);
          let end = moment(payload.endDate);
          tripId = JSON.parse(response.data).id;
          let flightTrips$ = this.expenseService.airlineTrips(
            userId,
            start,
            end
          );
          return flightTrips$;
        }
      }),
      flatMap((response) => {
        console.log(response);
        if (response.status == 200) {
          let flightArray = JSON.parse(response.data).data;
          return from(flightArray);
        }
      }),
      mergeMap((flightsTrip: any) => {
        console.log(flightsTrip);
        let payload: expensepayload = {
          accounts_approval: null,
          approved_accounts: null,
          approved_manager: null,
          attachementpath: { bills: [] },
          cost: flightsTrip.passenger_details.fare_response.published_fare,
          eligible_amount: 0,
          end_city: flightsTrip.trip_requests.Segments[0].DestinationName,
          end_date: flightsTrip.trip_requests.Segments[0].PreferredArrivalTime,
          manager_approval: null,
          travel_type: this.getTravelType(flightsTrip),
          no_of_days: moment(
            flightsTrip.trip_requests.Segments[0].PreferredArrivalTime
          ).diff(
            flightsTrip.trip_requests.Segments[0].PreferredDepartureTime,
            "days"
          ),
          paid_by: "paid_company",
          start_city: flightsTrip.trip_requests.Segments[0].OriginName,
          start_date:
            flightsTrip.trip_requests.Segments[0].PreferredDepartureTime,
          status: "new",
          trip_id: tripId,
          type: "flight",
        };

        let expense$ = this.expenseService.createExpense(payload);
        return expense$;
      }),
      toArray(),
      flatMap((response) => {
        console.log(response);
        payload.e_flag = 1;
        let editTrip$ = this.expenseService.editTrip(tripId, payload);
        return editTrip$;
      }),
      flatMap((response) => {
        console.log(response);
        return concat(
          states.dispatch(new GetTripList()),
          from(this.modalCtrl.dismiss(null, null, "trip"))
        );
      })
    );
  }

  @Action(AddExpense)
  addExpense(states: StateContext<expense>, action: AddExpense) {
    let expense : expensepayload = Object.assign({},action.expense);
    expense.start_date = moment(expense.start_date).format("YYYY-MM-DDT06:30:00.000Z");
    expense.end_date = moment(expense.end_date).format("YYYY-MM-DDT06:30:00.000Z");
    expense.trip_id = states.getState().currentTrip.id;
    expense.status = "new";
    expense.eligible_amount = this.eligibleAmount(expense.travel_type,expense.type);

    return this.expenseService.createExpense(expense)
      .pipe(
        map(
          (response : HTTPResponse) => {
            console.log(response);
            let exp = JSON.parse(response.data);
            console.log(exp);
            if(response.status == 200) {
              states.dispatch(new GetTripList());
              return from(this.modalCtrl.dismiss(null,null,'expense'));
            }
          }
        )
      );
  }

  @Action(EditExpense)
  editExpense(states: StateContext<any>, action: EditExpense) {
    return this.expenseService.updateExpense([action.expense])
    .pipe(
      map(
        (response : HTTPResponse) => {
          console.log(response);
          let exp = JSON.parse(response.data);
          console.log(exp);
          if(response.status == 200) {
            states.dispatch(new GetTripList());
            return from(this.modalCtrl.dismiss(null,null,'expense'));
          }
        }
      )
    );
  }

  @Action(DeleteExpense)
  deleteExpense(states: StateContext<expense>, action: DeleteExpense) {
    return from(action.exp)
      .pipe(
        concatMap(
          (expId : number) => {
            return this.expenseService.deleteExpense(expId)
              .pipe(
                map(
                  (response) => {
                    return response;
                  }
                )
              );
          }
        ),
        toArray(),
        map(
          (response :HTTPResponse[]) => {
            console.log(response);
            states.dispatch(new GetTripList());
          }
        )
      );
  }

  @Action(SelectExpense)
  selectExpense (states: StateContext<expense>, action: SelectExpense) {
    let Selected : expenselist[] = Object.assign([],states.getState().sendExp);
    let current : expenselist = Object.assign({},action.exp);
    Selected.push(current);
    states.patchState({
      sendExp : Selected
    });
  }

  @Action(DeselectExpense)
  deselectExpense (states: StateContext<expense>, action: DeselectExpense) {
    let Selected : expenselist[] = Object.assign([],states.getState().sendExp);
    let current : expenselist = Object.assign({},action.exp);
    states.patchState({
      sendExp : _.remove(Selected,(o) => !_.isEqual(current,o))
    });
  }

  @Action(UploadBill)
  uploadBill(states: StateContext<expense>, action: UploadBill) {

    let resolvePath : string = null;

    return from(this.fileChooser.open())
      .pipe(
        flatMap(
          (url : string) => {
            return from(this.filePath.resolveNativePath(url));
          }
        ),
        flatMap(
          (resolvePath : string) => {
            let transferObj : FileTransferObject = this.fileTransfer.create();
            resolvePath = resolvePath;

            let UrlSegment = resolvePath.split('/');
            let name = UrlSegment[UrlSegment.length - 1];

            let options : FileUploadOptions = {
              fileKey: "file",
              fileName: name,
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params : {'bill': name}
            };

            let upload$ : Observable<FileUploadResult> = from(transferObj.upload(resolvePath,environment.baseURL+"/tripexpense/expense/uploadBill",options));
            return upload$
              .pipe(
                catchError(
                  (error) => {
                    console.log(error);
                    return throwError(error);
                  }
                ),
                map(
                  (result) => {
                    console.log(result);
                    return result;
                  }
                )
              )
          }
        ),
        flatMap(
          (result) => {
            console.log(result,states,action);
            if(result.responseCode == 200) {
                let fileDetail$ : Observable<any> = from(this.file.resolveLocalFilesystemUrl(resolvePath));
                return fileDetail$;
              }
            }
          )
      );

    // console.log(this.fileChooser);
    // let url = await this.fileChooser.open();
    // let URL = await this.filePath.resolveNativePath(url);
    // let UrlSegment = URL.split('/');
    // let name = UrlSegment[UrlSegment.length - 1];
    // this.bills.push(this.createBill(url,name));

  }

  @Action(SendExpense)
  sendExpense(states: StateContext<expense>, action: SendExpense) {

    if(states.getState().sendExp.length >= 1) {
      return of(action.status)
        .pipe(
          flatMap(
            (status) => {
              if(status == 'send') {
                return this.expenseService.sendApproval(states.getState().sendExp);
              }
              else if(status == 'approve') {
                return this.expenseService.approveExpense(states.getState().sendExp);
              }
              else if(status == 'reject') {
                return this.expenseService.rejectExpense(states.getState().sendExp);
              }
            }
          ),
          map(
            (response) => {
              if(response.status == 200) {
                states.dispatch(new GetTripList());
              }
            }
          )
        );
    }
    else {
      return;
    }


  }

  eligibleAmount(traveltype : string, type : string) {
    switch(traveltype) {
      case "domestic" : return this.store.selectSnapshot(EligibilityState.getDomestic)[type];
      case "international" : return this.store.selectSnapshot(EligibilityState.getInternational)[type];
    }
  }

  getTravelType(flightDetail : any) : string{
    return (flightDetail.trip_requests.Segments as Array<any>)
      .every(el => el.DestinationCountryCode == el.OriginCountryCode) ? 'domestic' : 'international';
  }

}
