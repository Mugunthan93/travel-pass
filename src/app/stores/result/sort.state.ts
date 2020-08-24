import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ResultState, result, ResultMode } from '../result.state';
import * as _ from 'lodash';

export interface sort {
    flight: sortButton[]
    hotel: sortButton[]
    bus: sortButton[]
    currentFlight: sortButton
    currentHotel: sortButton
    currentBus: sortButton
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
            { label: 'hotel', state: 'default', property: 'HotelName' },
            { label: 'star', state: 'default', property: 'StarRating' },
            { label: 'price', state: 'default', property: 'PublishedPrice' }
        ],
        bus: [
            { label: 'departure', state: 'default', property: 'departureTime' },
            { label: 'arrival', state: 'default', property: 'arrivalTime' },
            { label: 'seat', state: 'default', property: 'availableSeats' },
            { label: 'fare', state: 'default', property: 'fare' }
        ],
        currentFlight: { label: 'price', state: 'rotated', property: 'fare' },
        currentHotel: { label: 'price', state: 'rotated', property: 'PublishedPrice' },
        currentBus: { label: 'fare', state: 'default', property: 'fare' }
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
        else if (resultstate.mode == 'bus') {
            return states.bus;
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

    @Selector()
    static getBusSortBy(states: sort): sortButton {
        return states.currentBus;
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
        else if (action.mode == 'bus') {
            let currentStates: sortButton[] = states.getState().bus.map(
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
                bus: currentStates,
                currentBus: action.button
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
        else if (action.mode == 'bus') {
            let currentsort: sortButton[] = states.getState().bus;
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
                bus: sortedarray,
                currentBus: action.button
            });
        }
    }

}