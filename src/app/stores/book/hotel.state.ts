import { State, StateContext, Action, Selector, Store } from '@ngxs/store';
import { dayRates, hotelprice, cancellationPolicy, hotelDetail, HotelResultState } from '../result/hotel.state';
import { managers, user_eligibility } from './flight.state';
import { hotelsearchpayload, HotelSearchState } from '../search/hotel.state';
import { UserState } from '../user.state';
import { CompanyState } from '../company.state';
import * as moment from 'moment';
import { of, from } from 'rxjs';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { tap, catchError } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';


export interface hotelbook {
    blockedRoom: blockedRoom
    passengers: passengers[]
    selectedpassengers: passengers[]
    mail: string[]
    purpose: string
    comment: string
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
    HotelRoomsDetails : RoomDetails[]
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

export interface hotelRequest {
    
    guest_details: guest_details
    hotel_requests: hotelsearchpayload
    
    transaction_id: any
    user_id: number
    customer_id: number
    booking_mode: string
    approval_mail_cc: string[]
    managers: managers
    trip_type: string
    comments: string
    purpose: string
}

export interface guest_details{
    passengers: passengers[]
    roomDetails: RoomDetails[]
    basiscInfo: basiscInfo
    servicecharge_details: service_charge
    userEligibility: user_eligibility
}

export interface passengers{
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

export interface basiscInfo{
    HotelName: string
    HotelCode: string
    HotelAddress: string
    HotelPolicy: string
    CityName: string
    CityId: string
    NoOfAdults: number
    NoOfChild: number
    NoOfRooms: number
    NoOfNights: number
    CheckInDate: string
    CheckOutDate: string
    TotalBaseFare: number
    tokenId: any,
    StarRating: number
}

export interface service_charge {
    service_charges: number
    sgst_Charges: number
    cgst_Charges: number
    igst_Charges: number
    total_amount: number
    markup_charges: number
    agency_markup: number
}

/////////////////////////////////////////////////////////

export class AddBlockRoom {
    static readonly type = "[hotel_book] AddBlockRoom";
    constructor(public room: blockedRoom) {

    }
}

export class MailCC {
    static readonly type = "[flight_book] MailCC";
    constructor(public mail: string[]) {

    }
}

export class Purpose {
    static readonly type = "[flight_book] Purpose";
    constructor(public purpose: string) {

    }
}

export class Comments {
    static readonly type = "[flight_book] Comment";
    constructor(public comment: string) {

    }
}

export class SendRequest {
    static readonly type = "[hotel_book] SendRequest";
}

@State<hotelbook>({
    name: 'hotel_book',
    defaults: {
        blockedRoom: null,
        passengers: [],
        selectedpassengers : [],
        mail: [],
        purpose: null,
        comment: null
    }
})
export class HotelBookState {

    constructor(
        private store: Store,
        private hotelService: HotelService
    ) {

    }

    @Selector()
    static getBlockedRoom(state: hotelbook): blockedRoom{
        return state.blockedRoom;
    }

    @Selector()
    static getRoomDetail(state: hotelbook): RoomDetails[] {
        return state.blockedRoom.HotelRoomsDetails;
    }

    @Selector()
    static getCC(states: hotelbook): string[] {
        return states.mail;
    }

    @Selector()
    static getPurpose(states: hotelbook): string {
        return states.purpose;
    }

    @Selector()
    static getComment(states: hotelbook): string {
        return states.comment;
    }

    @Selector()
    static getPassengers(states: hotelbook): passengers[] {
        return states.passengers;
    }

    @Action(AddBlockRoom)
    addBlockRoom(states: StateContext<hotelbook>, action: AddBlockRoom) {

        let lead: passengers = {
            PaxType: 1,
            LeadPassenger: true,
            count: 1,
            FirstName: this.store.selectSnapshot(UserState.getFirstName),
            LastName: this.store.selectSnapshot(UserState.getFirstName),
            Email: this.store.selectSnapshot(UserState.getEmail),
            PAN: null,
            Title: this.store.selectSnapshot(UserState.getTitle) == 'Female' ? 'Ms' : 'Mr',
            Gender: this.store.selectSnapshot(UserState.getTitle)
        }

        let passengers: passengers[] = Object.assign([],states.getState().passengers);
        passengers.push(lead);

        states.patchState({
            blockedRoom: action.room,
            passengers : passengers
        });
    }

    @Action(MailCC)
    mailCC(states: StateContext<hotelbook>, action: MailCC) {
        states.patchState({
            mail: action.mail
        });
    }

    @Action(Purpose)
    purpose(states: StateContext<hotelbook>, action: Purpose) {
        states.patchState({
            purpose: action.purpose
        });
    }

    @Action(Comments)
    comment(states: StateContext<hotelbook>, action: Comments) {
        states.patchState({
            comment: action.comment
        });
    }

    @Action(SendRequest)
    sendRequest(states: StateContext<hotelbook>, action: SendRequest) {

        let sgst: number = 0;
        let cgst: number = 0;
        let igst: number = 0;
        let total_amt: number = 0;

        let checkin: string = moment(this.store.selectSnapshot(HotelSearchState.getSearchData).checkin).format('YYYY-MM-DD');
        let checkout: string = moment(this.store.selectSnapshot(HotelSearchState.getSearchData).checkout).format('YYYY-MM-DD');

        states.getState().blockedRoom.HotelRoomsDetails.forEach(
            (el) => {

                sgst += el.Price.GST.SGSTAmount;
                cgst += el.Price.GST.CGSTAmount;
                igst += el.Price.GST.IGSTAmount;
                total_amt += el.Price.PublishedPrice;
            }
        );

        let passengers : passengers[] = Object.assign([], states.getState().selectedpassengers);

        passengers.sort((a,b) => {
            if (a.LeadPassenger == true) {
                return -1;
            }
            else if(a.LeadPassenger == false) {
                return 1;
            }
            else {
                return 0;
            }
        });


        let request: hotelRequest = {
            guest_details: {
                passengers: passengers,
                roomDetails: states.getState().blockedRoom.HotelRoomsDetails,
                basiscInfo: {
                    HotelName: states.getState().blockedRoom.HotelName,
                    HotelCode: this.store.selectSnapshot(HotelResultState.getHotelCode),
                    HotelAddress: states.getState().blockedRoom.AddressLine1 + states.getState().blockedRoom.AddressLine2,
                    HotelPolicy: states.getState().blockedRoom.HotelPolicyDetail,
                    CityName: this.store.selectSnapshot(HotelSearchState.getSearchData).city.destination,
                    CityId: this.store.selectSnapshot(HotelSearchState.getSearchData).city.cityid.toString(),
                    NoOfAdults: this.store.selectSnapshot(HotelSearchState.getTotalAdult),
                    NoOfChild: this.store.selectSnapshot(HotelSearchState.getTotalChildren),
                    NoOfRooms: this.store.selectSnapshot(HotelSearchState.getRooms).length,
                    NoOfNights: moment(checkout).diff(checkin, 'days'),
                    CheckInDate: checkin,
                    CheckOutDate: checkout,
                    TotalBaseFare: total_amt,
                    tokenId: null,
                    StarRating: states.getState().blockedRoom.StarRating
                },
                servicecharge_details: {
                    service_charges: this.serviceCharges(),
                    sgst_Charges: sgst,
                    cgst_Charges: cgst,
                    igst_Charges: igst,
                    total_amount: total_amt,
                    markup_charges: 0,
                    agency_markup: 0
                },
                userEligibility: {
                    msg: null,
                    company_type: 'corporate'
                }
            },
            hotel_requests: this.store.selectSnapshot(HotelSearchState.getPayload),
            
            transaction_id: null,
            user_id: this.store.selectSnapshot(UserState.getUserId),
            customer_id: this.store.selectSnapshot(UserState.getcompanyId),
            booking_mode: 'online',
            approval_mail_cc: states.getState().mail,
            managers: this.store.selectSnapshot(UserState.getApprover),
            trip_type: 'business',
            comments: states.getState().comment,
            purpose: states.getState().purpose
        }

        return from(this.hotelService.sendRequest(request))
            .pipe(
                tap(
                    (el : HTTPResponse) => {
                        console.log(el);
                        return of(el);
                    }
                ),
                catchError(
                    (err) => {
                        console.log(err);
                        return of(err);
                    }
                )
            )

    }

    serviceCharges(): number {
        let serviceCharge: number = 0;
        serviceCharge = this.store.selectSnapshot(CompanyState.getHotelServiceCharge) * this.store.selectSnapshot(HotelSearchState.getGuest);
        return serviceCharge;
    }

}