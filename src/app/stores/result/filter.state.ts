import { State } from '@ngxs/store';
import { FlightFilterState } from './filter/flight.filter.state';
import { DepartureFilterState } from './filter/departure.filter.state';
import { ReturnFilterState } from './filter/return.filter.state';
import { HotelFilterState } from './filter/hotel.filter.state';
import { BusFilterState } from './filter/bus.filter.state';
import { Injectable } from '@angular/core';

@State<any>({
    name: 'filter',
    children: [
        FlightFilterState,
        DepartureFilterState,
        ReturnFilterState,
        HotelFilterState,
        BusFilterState
    ]
})

@Injectable()
export class FilterState {

}
