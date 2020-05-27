import { State } from '@ngxs/store';
import { OneWayState } from './flight/oneway.state';
import { RoundTripState } from './flight/roundtrip.state';
import { MultiCityState } from './flight/multicity.state';


@State<any>({
    name: 'Flight',
    defaults: null,
    children: [
        OneWayState,
        RoundTripState,
        MultiCityState
    ]
})
export class FLightState {
    
}