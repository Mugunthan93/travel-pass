import { State } from '@ngxs/store';

export interface buspassengerstate{
    travellerList: buspassenger[]
    selected: buspassenger[]
}


export interface buspassenger {
    primary: boolean,
    email: string,
    name: string,
    lastName: string,
    Address: string,
    mobile: string,
    idType: string,
    idNumber: string,
    title: string,
    sex: string,
    age: string,
    seatNbr: any,
    fare: number,
    serviceTaxAmount: number,
    operatorServiceChargeAbsolute: number,
    totalFareWithTaxes: number,
    ladiesSeat: boolean,
    nameOnId: string,
    ac: boolean,
    sleeper: boolean,
    prefSeat: string
}

@State<buspassengerstate>({
    name: 'bus_passenger',
    defaults: {
        travellerList: [],
        selected : []
    }
})
export class BusPassengerState {

    constructor() {
        
    }

}