
import { State } from '@ngxs/store';

export interface trainMultiCitySearch {
    formData: any,
    payload: any,
    tripType: any
}

@State<trainMultiCitySearch>({
    name: 'trainMultiCitySearch',
    defaults: {
        formData: null,
        payload: null,
        tripType: null
    }
})

export class TrainMultiCitySearchState {

    constructor() {

    }



}