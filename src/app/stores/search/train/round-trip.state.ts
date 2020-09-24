import { State } from '@ngxs/store';

export interface trainRoundTripSearch {
    formData: any,
    payload: any,
    tripType: any
}

@State<trainRoundTripSearch>({
    name: 'trainRoundTripSearch',
    defaults: {
        formData: null,
        payload: null,
        tripType: null
    }
})

export class TrainRoundTripSearchState {

    constructor() {

    }



}