import { State } from '@ngxs/store';
import { FlightPassengerState } from './passenger/flight.passenger.states';
import { HotelPassengerState } from './passenger/hotel.passenger.state';
import { BusPassengerState } from './passenger/bus.passenger.state';
import { TrainPassengerState } from './passenger/train.passenger.state';

@State({
    name: 'passenger',
    defaults: null,
    children: [
        FlightPassengerState,
        HotelPassengerState,
        BusPassengerState,
        TrainPassengerState
    ]
})
export class PassengerState {

    constructor() {
        
    }

}