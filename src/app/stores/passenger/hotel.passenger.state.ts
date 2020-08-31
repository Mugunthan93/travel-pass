import { State } from '@ngxs/store';

export interface hotelpassengerstate{
    guestList: hotelpassenger[]
    selected: hotelpassenger[]
}

export interface hotelpassenger {
    PaxType: number
    LeadPassenger: boolean
    count: number
    FirstName: string
    LastName: string

    Email?: string
    PAN?: string
    Title?: string
    Gender?: string
}

@State<hotelpassengerstate>({
    name: 'hotel_passenger',
    defaults: {
        guestList: [],
        selected: []
    }
})
export class HotelPassengerState {

    constructor() {
        
    }

}