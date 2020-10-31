import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { SharedService } from '../services/shared/shared.service';
import { map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { UserState } from './user.state';


export interface eligibility {
    international: gradeValue
    domestic: gradeValue
} 

export interface gradeArray {
    company_id: number
    createdAt: string
    grade: string
    id: number
    trip_type: string
    updatedAt: string
    value: gradeValue
}

export interface gradeValue {
    bus: string
    cab: string
    flight: string
    food: string
    hotel: string
    localtravel: string
    train: string
}

export class GetEligibility {
    static readonly type = "eligibility [GetEligibility]";
    constructor(public companyId : number) {

    }
}

@State<eligibility>({
    name: 'eligibility',
    defaults: {
        international: null,
        domestic: null
    }
})
    
export class EligibilityState {

    constructor(
        private sharedService: SharedService,
        private store : Store
    ) {

    }

    @Selector()
    static getDomestic(state: eligibility) {
        return state.domestic;
    }

    @Selector()
    static getInternational(state: eligibility) {
        return state.international;
    }

    @Action(GetEligibility)
    getEligibility(states: StateContext<eligibility>, action: GetEligibility) {
        return this.sharedService.getEligibility(action.companyId)
            .pipe(
                map(
                    (response : HTTPResponse) => {
                        let gradearray: gradeArray[] = JSON.parse(response.data).data;
                        let usergrade: string = this.store.selectSnapshot(UserState.getGrade);
                        let filteredArray = gradearray.filter(el => el.grade == usergrade);
                        filteredArray.forEach(
                            (el) => {
                                console.log(el);
                                if (el.trip_type == "International")
                                {
                                    states.patchState({
                                        international: {
                                            bus: el.value.bus.toString(),
                                            cab: el.value.cab.toString(),
                                            flight: el.value.flight.toString(),
                                            food: el.value.food.toString(),
                                            hotel: el.value.hotel.toString(),
                                            localtravel: el.value.localtravel.toString(),
                                            train: el.value.train.toString()
                                        }
                                    });
                                }
                                else if (el.trip_type == "Domestic") {
                                    states.patchState({
                                        domestic: {
                                            bus: el.value.bus.toString(),
                                            cab: el.value.cab.toString(),
                                            flight: el.value.flight.toString(),
                                            food: el.value.food.toString(),
                                            hotel: el.value.hotel.toString(),
                                            localtravel: el.value.localtravel.toString(),
                                            train: el.value.train.toString()
                                        }
                                    });
                                }
                            }
                        );

                    }
                )
            );
    }

}