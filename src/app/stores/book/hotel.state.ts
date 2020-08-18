import { State, StateContext, Action, Selector } from '@ngxs/store';
import { dayRates, hotelprice, cancellationPolicy, hotelDetail } from '../result/hotel.state';


export interface hotelbook {
    blockedRoom : blockedRoom
}

export interface blockedRoom {
    TraceId: string
    ResponseStatus: number
    Error: {
        ErrorCode: number
        ErrorMessage: any
    }
    IsCancellationPolicyChanged: boolean
    IsHotelPolicyChanged: boolean
    IsPriceChanged: boolean
    IsPackageFare: boolean
    IsPackageDetailsMandatory: boolean
    AvailabilityType: string
    GSTAllowed: boolean
    HotelNorms: string
    HotelName: string
    AddressLine1: string
    AddressLine2: string
    StarRating: number
    HotelPolicyDetail: string
    Latitude: string
    Longitude: string
    BookingAllowedForRoamer: boolean
    AncillaryServices: any[]
    roomDetails : RoomDetails[]
    
}

export interface RoomDetails {
    AvailabilityType: string
    ChildCount: number
    RequireAllPaxDetails: boolean
    RoomId: number
    RoomStatus: number
    RoomIndex: number
    RoomTypeCode: string
    RoomDescription: string
    RoomTypeName: string
    RatePlanCode: string
    RatePlan: number
    InfoSource: string
    SequenceNo: string
    DayRates: dayRates[]
    IsPerStay: boolean
    SupplierPrice: any
    Price: hotelprice
    RoomPromotion: any
    Amenities: any[]
    Amenity: any[]
    SmokingPreference: string
    BedTypes: any[]
    HotelSupplements: any[]
    LastCancellationDate: string
    CancellationPolicies: cancellationPolicy[]
    LastVoucherDate: string
    CancellationPolicy: string
    Inclusion: any[]
    IsPassportMandatory: boolean
    IsPANMandatory: boolean
}

/////////////////////////////////////////////////////////

export class AddBlockRoom {
    static readonly type = "[hotel_book] AddBlockRoom";
    constructor(public room: blockedRoom) {

    }
}

@State<hotelbook>({
    name: 'hotel_book',
    defaults: {
        blockedRoom : null
    }
})
export class HotelBookState {

    constructor() {

    }

    @Selector()
    static getBlockedRoom(state: hotelbook): blockedRoom{
        return state.blockedRoom;
    }

    @Selector()
    static getRoomDetail(state: hotelbook): hotelDetail[] {
        return state.blockedRoom.roomDetails;
    }

    @Action(AddBlockRoom)
    addBlockRoom(states: StateContext<hotelbook>, action: AddBlockRoom) {
        states.patchState({
            blockedRoom : action.room
        });
    }

}