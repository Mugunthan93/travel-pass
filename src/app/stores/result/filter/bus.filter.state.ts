import { State, Action, StateContext, Selector } from "@ngxs/store";
import { resultObj } from '../flight.state';
import * as _ from 'lodash';
import { busResponse } from '../bus.state';
import { Injectable } from "@angular/core";


export interface busFilter {
    depatureHours: number
    arrivalHours: number
    busType: busType[]
}

export interface busType {
    name: string,
    value: boolean
}

export class SetBusDeparture {
    static readonly type = '[bus_filter] SetBusDeparture';
    constructor(public dep: number) {

    }
}

export class SetBusArrival {
    static readonly type = '[bus_filter] SetBusArrival';
    constructor(public arr: number) {

    }
}

export class SetBusType {
    static readonly type = '[bus_filter] SetBusType';
    constructor(public type: busType, public busboolean: boolean) {

    }
}

export class ResetBusType {
    static readonly type = '[bus_filter] ResetBusType';
}



export class GetBusType {
    static readonly type = '[bus_filter] GetBusType';
    constructor(public result: busResponse[], public type?: string) {

    }
}

export class GetFilter {
    static readonly type = '[bus_filter] GetFilter';
    constructor(public filter: busFilter, public type?: string) {

    }
}


@State<busFilter>({
    name: 'bus_filter',
    defaults: {
        depatureHours: 24,
        arrivalHours: 24,
        busType: [],
    }
})

@Injectable()
export class BusFilterState {

    constructor() {

    }

    @Selector()
    static getBusFilter(states: busFilter) {
        return states;
    }

    @Action(GetBusType)
    getBusType(states: StateContext<busFilter>, action: GetBusType) {
        let buses: busType[] = [];
        action.result.forEach(
            (el) => {
                buses.push({
                    name: el.operatorName,
                    value: false
                });
            }
        );

        states.patchState({
            depatureHours: 24,
            arrivalHours: 24,
            busType: _.uniqBy(buses, 'name')
        })

    }

    @Action(SetBusDeparture)
    setdeparture(states: StateContext<busFilter>, action: SetBusDeparture) {
        states.patchState({
            depatureHours: action.dep
        });
    }

    @Action(SetBusArrival)
    setArrrival(states: StateContext<busFilter>, action: SetBusArrival) {
        states.patchState({
            arrivalHours: action.arr
        });
    }

    @Action(SetBusType)
    setAirline(states: StateContext<busFilter>, action: SetBusType) {

        let bustype: busType[] = Object.assign([], states.getState().busType);
        let setbustype: busType[] = bustype.map(
            (el) => {
                if (_.isEqual(el,action.type)) {
                    let newbus: busType = Object.assign({}, el);
                    newbus.value = action.busboolean;
                    return newbus;
                }
                return el;
            }
        );

        states.patchState({
            busType: setbustype
        });
    }

    @Action(ResetBusType)
    resetAirlines(states: StateContext<busFilter>) {
        let airlines: busType[] = Object.assign([],states.getState().busType);
        let init: busType[] = airlines.map(
            (el) => {
                let item: busType = Object.assign({},el);
                item.value = false;
                return item;
            }
        );

        states.patchState({
            busType : init
        });
    }

    @Action(GetFilter)
    getFilter(states: StateContext<busFilter>, action: GetFilter) {
        states.patchState(action.filter);
    }

}
