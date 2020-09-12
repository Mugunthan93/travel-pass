import { State } from '@ngxs/store';
import { FlightFilterState } from './filter/flight.filter.state';
import { DepartureFilterState } from './filter/departure.filter.state';
import { ReturnFilterState } from './filter/return.filter.state';

@State<any>({
    name: 'filter',
    children: [
        FlightFilterState,
        DepartureFilterState,
        ReturnFilterState
    ]
})

export class FilterState {

}