import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { SharedService } from '../services/shared/shared.service';
import { map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { UserState } from './user.state';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';


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
    othertravel? : number
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

@Injectable()
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
                        console.log(filteredArray);
                        filteredArray.forEach(
                            (el) => {
                                if (el.trip_type == "International")
                                {
                                    states.patchState({
                                        international: {
                                            bus:  this.eligible(el.value.bus),
                                            cab: this.eligible(el.value.cab),
                                            flight: this.eligible(el.value.flight),
                                            food: this.eligible(el.value.food),
                                            hotel: this.eligible(el.value.hotel),
                                            localtravel: this.eligible(el.value.localtravel),
                                            train: this.eligible(el.value.train),
                                            othertravel: this.eligible(el.value.othertravel)
                                        }
                                    });
                                }
                                else if (el.trip_type == "Domestic") {
                                    states.patchState({
                                        domestic: {
                                          bus:  this.eligible(el.value.bus),
                                          cab: this.eligible(el.value.cab),
                                          flight: this.eligible(el.value.flight),
                                          food: this.eligible(el.value.food),
                                          hotel: this.eligible(el.value.hotel),
                                          localtravel: this.eligible(el.value.localtravel),
                                          train: this.eligible(el.value.train),
                                          othertravel: this.eligible(el.value.othertravel)
                                        }
                                    });
                                }
                            }
                        );

                    }
                )
            );
    }

    eligible(value : any) {
      if(_.isString(value)) {
        return parseInt(value);
      }
      else if(_.isNumber(value)) {
        return value;
      }
      else {
        return 0;
      }
    }

}
