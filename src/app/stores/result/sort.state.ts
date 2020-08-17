import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ResultState, result, ResultMode } from '../result.state';
import * as _ from 'lodash';

export interface sort {
    flight: sortButton[]
    hotel: sortButton[]
    currentFlight: sortButton
    currentHotel: sortButton
}

export interface sortButton {
    label: string
    state: string
    property: string
}

export class SortChange {
    static readonly type = "[Sort] SortChange";
    constructor(public button : sortButton, public mode : string) {

    }
}

export class SortBy {
    static readonly type = "[Sort] SortBy";
    constructor(public button: sortButton, public mode: string) {

    }
}


@State<sort>({
    name: 'sort',
    defaults: {
        flight: [
            { label: 'departure', state: 'default', property: 'departure' },
            { label: 'arrival', state: 'default', property: 'arrival' },
            { label: 'duration', state: 'default', property: 'Duration' },
            { label: 'price', state: 'default', property: 'fare' }
        ],
        hotel: [
            { label: 'price', state: 'default', property: 'PublishedPrice' },
            { label: 'star', state: 'default', property: 'StarRating' },
            { label: 'hotel', state: 'default', property: 'HotelName' },
        ],
        currentFlight: { label: 'price', state: 'rotated', property: 'fare' },
        currentHotel: { label: 'price', state: 'rotated', property: 'PublishedPrice' }
    }
})

export class SortState {

    constructor() {

    }

    @Selector([ResultState])
    static getButtons(states: sort, resultstate : result): sortButton[] {
        if (resultstate.mode == 'flight') {
            return states.flight;    
        }
        else if (resultstate.mode == 'hotel') {
            return states.hotel;
        }
    }

    @Selector()
    static getFlightSortBy(states: sort): sortButton {
        return states.currentFlight;
    }

    @Selector()
    static getHotelSortBy(states: sort): sortButton {
        return states.currentHotel;
    }



    @Action(SortChange)
    sortChange(states: StateContext<sort>, action: SortChange) {
        
        if (action.mode == 'flight') {
            let currentStates: sortButton[] = states.getState().flight.map(
                (el: sortButton) => {
                    if (!_.isEqual(action.button,el)) {
                        let currentstate = Object.assign({}, el);
                        currentstate.state = "default";
                        return currentstate;
                    }
                    else {
                        return el;
                    }
                });
            states.patchState({
                flight: currentStates,
                currentFlight: action.button
            });
        }
        else if (action.mode == 'hotel') {
            let currentStates: sortButton[] = states.getState().flight.map(
                (el: sortButton) => {
                    if (!_.isEqual(action.button, el)) {
                        let currentstate = Object.assign({}, el);
                        currentstate.state = "default";
                        return currentstate;
                    }
                    else {
                        return el;
                    }
                });
            states.patchState({
                flight: currentStates,
                currentFlight: action.button
            });
        }

    }

    @Action(SortBy)
    sortBy(states: StateContext<sort>, action: SortBy) {

        if (action.mode == 'flight') {

            let currentsort: sortButton[] = states.getState().flight;
            let sortedarray: sortButton[] = [];
            currentsort.forEach((el, ind, arr) => {
                if (_.isEqual(action.button, el) && action.button.state == 'default') {
                    sortedarray[ind] = {
                        label: action.button.label,
                        property: action.button.property,
                        state: 'rotated'
                    }
                }
                else if (_.isEqual(action.button, el) && action.button.state == 'rotated') {
                    sortedarray[ind] = {
                        label: action.button.label,
                        property: action.button.property,
                        state: 'default'
                    }
                }
                else {
                    sortedarray[ind] = el;
                }
            });

            states.patchState({
                flight: sortedarray,
                currentFlight: action.button
            });
            
        }
        else if (action.mode == 'hotel') {

            let currentsort: sortButton[] = states.getState().hotel;
            let sortedarray: sortButton[] = [];
            currentsort.forEach((el, ind, arr) => {
                if (_.isEqual(action.button, el) && action.button.state == 'default') {
                    sortedarray[ind] = {
                        label: action.button.label,
                        property: action.button.property,
                        state: 'rotated'
                    }
                }
                else if (_.isEqual(action.button, el) && action.button.state == 'rotated') {
                    sortedarray[ind] = {
                        label: action.button.label,
                        property: action.button.property,
                        state: 'default'
                    }
                }
                else {
                    sortedarray[ind] = el;
                }
            });

            states.patchState({
                hotel: sortedarray,
                currentHotel: action.button
            });
            
        }
    }

}