import { State } from '@ngxs/store';
import { segments } from './one-way.state';

export interface trainRoundTripBook {
    departure: segments
    return: segments
}

@State<trainRoundTripBook>({
    name: 'trainRoundTripBook',
    defaults: {
        departure: null,
        return: null
    }
})

export class TrainRoundTripBookState {
    
}