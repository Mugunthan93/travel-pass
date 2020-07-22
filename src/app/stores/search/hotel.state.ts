import { State, Action, StateContext } from '@ngxs/store';
import { SharedService } from 'src/app/services/shared/shared.service';


export interface hotelsearch{
    payload : hotelsearchpayload
    
}

export interface hotelsearchpayload {
    CheckInDate: string
    CityId: string
    CountryCode: string
    EndUserIp: string
    GuestNationality: string
    IsNearBySearchAllowed: boolean
    IsTBOMapped: boolean
    MaxRating: number
    MinRating: number
    NoOfNights: string
    NoOfRooms: string
    PreferredCurrency: string
    PreferredHotel: string
    ResultCount: any
    ReviewScore: any
    RoomGuests: roomguest[]
}

export interface roomguest {
    ChildAge: number[]
    NoOfAdults: number
    NoOfChild: number
}

////////////////////////////////////////////////////////////////////////////

@State<hotelsearch>({
    name: 'hotel_search',
    defaults : null
})
export class HotelSearchState {

    constructor(
        private sharedService : SharedService
    ) {

    }

    
}