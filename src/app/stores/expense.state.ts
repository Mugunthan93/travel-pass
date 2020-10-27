import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import { of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
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
}

export class ChangeEndDate {
    static readonly type = "[expense] ChangeEndDate";
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
        startdate: moment({}).subtract(1, "months"),
        enddate :  moment({})
    }
})

export class ExpenseState {

    constructor(
        private store : Store,
        private expenseService : ExpenseService
    ) {

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

        let startDate = states.getState().startdate;
        let endDate = states.getState().enddate;
        let userId : number = this.store.selectSnapshot(UserState.getUserId);

        let tripList$ = this.expenseService.getTripList(userId,startDate,endDate);

        return tripList$
            .pipe(
                flatMap(
                    (response) => {
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


    
}