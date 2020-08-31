import { State } from '@ngxs/store';
import { FlightPassengerState } from './passenger/flight.passenger.states';
import { HotelPassengerState } from './passenger/hotel.passenger.state';
import { BusPassengerState } from './passenger/bus.passenger.state';

@State({
    name: 'passenger',
    defaults: null,
    children: [
        FlightPassengerState,
        HotelPassengerState,
        BusPassengerState
    ]
})
export class PassengerState {

    constructor() {
        
    }

}