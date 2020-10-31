import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { SharedService } from '../services/shared/shared.service';
import { map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { UserState } from './user.state';
import * as _ from 'lodash';


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
    bus: number
    cab: number
    flight: number
    food: number
    hotel: number
    localtravel: number
    train: number
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
                        let gradearray: any[] = JSON.parse(response.data).data;
                        let usergrade: string = this.store.selectSnapshot(UserState.getGrade);
                        let filteredArray = gradearray.filter(el => el.grade == usergrade);
                        filteredArray.forEach(
                            (el) => {
                                if (el.trip_type == "International")
                                {
                                    states.patchState({
                                        international: {
                                            bus:  _.isNumber(el.value.bus) ? el.value.bus : parseInt(el.value.bus),
                                            cab: _.isNumber(el.value.cab) ? el.value.cab : parseInt(el.value.cab),
                                            flight: _.isNumber(el.value.flight) ? el.value.flight : parseInt(el.value.flight),
                                            food: _.isNumber(el.value.food) ? el.value.food : parseInt(el.value.food),
                                            hotel: _.isNumber(el.value.hotel) ? el.value.hotel : parseInt(el.value.hotel),
                                            localtravel: _.isNumber(el.value.localtravel) ? el.value.localtravel : parseInt(el.value.localtravel),
                                            train: _.isNumber(el.value.train) ? el.value.train : parseInt(el.value.train)
                                        }
                                    });
                                }
                                else if (el.trip_type == "Domestic") {
                                    states.patchState({
                                        domestic: {
                                            bus:  _.isNumber(el.value.bus) ? el.value.bus : parseInt(el.value.bus),
                                            cab: _.isNumber(el.value.cab) ? el.value.cab : parseInt(el.value.cab),
                                            flight: _.isNumber(el.value.flight) ? el.value.flight : parseInt(el.value.flight),
                                            food: _.isNumber(el.value.food) ? el.value.food : parseInt(el.value.food),
                                            hotel: _.isNumber(el.value.hotel) ? el.value.hotel : parseInt(el.value.hotel),
                                            localtravel: _.isNumber(el.value.localtravel) ? el.value.localtravel : parseInt(el.value.localtravel),
                                            train: _.isNumber(el.value.train) ? el.value.train : parseInt(el.value.train)
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