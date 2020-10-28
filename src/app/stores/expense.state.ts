import { Navigate } from '@ngxs/router-plugin';
import { Action, NgxsOnChanges, NgxsSimpleChange, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import { combineLatest, of } from 'rxjs';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';
import { ExpenseService } from '../services/expense/expense.service';
import { UserState } from './user.state';

export interface expense {
    trips : triplist[],
    expenses : any[],
    startdate : moment.Moment
    enddate: moment.Moment
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


@State<expense>({
    name: 'expense',
    defaults: {
        trips : [],
        expenses : [],
        enddate: moment({}).subtract(1, "months"),
        startdate :  moment({})
    }
})

export class ExpenseState implements NgxsOnChanges {

    constructor(
        private store : Store,
        private expenseService : ExpenseService
    ) {

    }
    ngxsOnChanges(change: NgxsSimpleChange<any>): void {
        console.log(change);
        if(
            !(change.currentValue.startdate as moment.Moment).isSame(change.previousValue.startdate) ||
            !(change.currentValue.enddate as moment.Moment).isSame(change.previousValue.enddate)
        ) {
            this.store.dispatch(new GetTripList());
        }
    }

    @Selector()
    static getTripList(state : expense) : triplist[] {
        return state.trips;
    }

    @Selector()
    static getStartDate(state : expense) : moment.Moment {
        return state.startdate;
    }

    @Selector()
    static getEndDate(state : expense) : moment.Moment {
        return state.enddate;
    }

    @Action(GetTripList)
    getTripList(states : StateContext<expense>) {

        states.patchState({
            trips : []
        });

        let startDate$ = of(states.getState().startdate);
        let endDate$ = of(states.getState().enddate);

        return  this.store.select(UserState.getUserId)
            .pipe(
                withLatestFrom(startDate$,endDate$),
                flatMap(
                    (dates) => {
                        let tripList$ = this.expenseService.getTripList(dates[0],dates[1],dates[2]);
                
                        return tripList$
                            .pipe(
                                flatMap(
                                    (response) => {
                                        console.log(response);
                                        let data : triplist[] = JSON.parse(response.data);
                                        console.log(data);
                                        states.patchState({
                                            trips : data
                                        });
                                        return of(response);
                                    }
                                )
                            );
                    }
                )
            );


    }

    @Action(GetExpenseList)
    getExpenseList(states : StateContext<expense>,action : GetExpenseList) {

        states.patchState({
            expenses : []
        });

        let expenselist$ = this.expenseService.getExpenseList(action.trip.id);
        return expenselist$
        .pipe(
            flatMap(
                (response) => {
                    console.log(response);
                    if(response.status == 200) {
                        let data : any[] = JSON.parse(response.data);
                        console.log(data);
                        states.patchState({
                            expenses : data
                        });
                        states.dispatch(new Navigate(['/','home','expense-list']));
                    }
                    return of(response);
                }
            )
        );
        
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


    
}