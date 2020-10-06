import { State } from '@ngxs/store';
import { segments } from './one-way.state';

export interface trainMultiCityBook {
    segmentArray : segments[]
}

@State<trainMultiCityBook>({
    name: 'trainMultiCityBook',
    defaults: {
        segmentArray: []
    }
})

export class TrainMultiCityBookState {

}