import { State, StateContext, Action, Selector, Store } from '@ngxs/store';
import { dayRates, hotelprice, cancellationPolicy, HotelResultState } from '../result/hotel.state';
import { managers, user_eligibility } from './flight.state';
import { hotelsearchpayload, HotelSearchState, AddAdult } from '../search/hotel.state';
import { UserState } from '../user.state';
import { CompanyState } from '../company.state';
import * as moment from 'moment';
import { of, from, forkJoin } from 'rxjs';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { catchError, flatMap } from 'rxjs/operators';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { AddAdultPassenger, AddChildPassenger, HotelPassengerState } from '../passenger/hotel.passenger.state';


export interface hotelbook {
    blockedRoom: blockedRoom
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
    status : string
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
    Age?: number
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

export class HotelRequest {
    static readonly type = "[hotel_book] HotelRequest";
    constructor(public comment: string, public mailCC: string[],public purpose : string) {

    }
}

export class HotelOfflineRequest {
    static readonly type = "[hotel_book] HotelOfflineRequest";
    constructor(public comment: string, public mailCC: string[],public purpose : string) {

    }
}

@State<hotelbook>({
    name: 'hotel_book',
    defaults: {
        blockedRoom: null
    }
})
export class HotelBookState {

    constructor(
        private store: Store,
        private hotelService: HotelService,
        public modalCtrl : ModalController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController
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

    @Action(AddBlockRoom)
    addBlockRoom(states: StateContext<hotelbook>, action: AddBlockRoom) {

        let lead: passengers = {
            PaxType: 1,
            LeadPassenger: true,
            count: 0,
            FirstName: this.store.selectSnapshot(UserState.getFirstName),
            LastName: this.store.selectSnapshot(UserState.getFirstName),
            Email: this.store.selectSnapshot(UserState.getEmail),
            PAN: null
        }

        states.dispatch(new AddAdultPassenger(lead));
        let rooms = this.store.selectSnapshot(HotelSearchState.getRooms);

        rooms.forEach(
            (room) => {
                room.ChildAge.forEach(
                    (age) => {
                        let child: passengers = {
                            PaxType: 2,
                            LeadPassenger: false,
                            count: 1,
                            Age: age,
                            FirstName: null,
                            LastName: null
                        }
                        states.dispatch(new AddChildPassenger(child));
                    }
                );
            }
        );

        states.patchState({
            blockedRoom: action.room
        });
    }

    @Action(HotelRequest)
    sendRequest(states: StateContext<hotelbook>, action: HotelRequest) {

        let loading$ = from(this.loadingCtrl.create({
            spinner: 'crescent',
            message: 'Sending Request...',
            id: 'send-req-loading'
        })).pipe(
            flatMap(
                (loadingEl) => {
                    return from(loadingEl.present());
                }
            )
        );

        let failedAlert$ = from(this.alertCtrl.create({
            header: 'Send Request Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                handler: () => {
                    return false;
                }
            }]
        })).pipe(
            flatMap(
                (alertEl) => {
                    return from(alertEl.present());
                }
            )
        );

        let successAlert$ = from(this.alertCtrl.create({
            header: 'Request Success',
            subHeader: 'Send Request Success',
            message: 'Request Sent Successfully..',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        states.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']))
                        .subscribe({
                            complete: () => {
                                this.modalCtrl.dismiss(null, null,'book-confirm');
                                }
                            });
                    }
                }
            ]
        })).pipe(
            flatMap(
                (alertEl) => {
                    return from(alertEl.present());
                }
            )
        );

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

        let selectedadult = this.store.selectSnapshot(HotelPassengerState.GetSelectAdult);
        let selectedchildren = this.store.selectSnapshot(HotelPassengerState.GetSelectChildren);

        let passengers: passengers[] = Object.assign([], [...selectedadult, ...selectedchildren]);

        passengers.sort((a) => {
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
            status: "pending",
            transaction_id: null,
            user_id: this.store.selectSnapshot(UserState.getUserId),
            customer_id: this.store.selectSnapshot(UserState.getcompanyId),
            booking_mode: 'online',
            approval_mail_cc: action.mailCC,
            managers: this.store.selectSnapshot(UserState.getApprover),
            trip_type: 'business',
            comments: action.comment,
            purpose: action.purpose
        }

        let sendRequest$ = from(this.hotelService.sendRequest(request));

        return forkJoin(loading$, sendRequest$)
            .pipe(
                flatMap(
                    (el) => {
                        console.log(el);
                        if (el[1].status == 200) {  
                            console.log(JSON.parse(el[1].data));
                            return forkJoin(from(this.loadingCtrl.dismiss(null, null, 'send-req-loading')),successAlert$);
                        }
                        else {
                            return forkJoin(from(this.loadingCtrl.dismiss(null, null, 'send-req-loading')), failedAlert$);
                        }
                    }
                ),
                catchError(
                    (error) => {
                        console.log(error);
                        return of(error);
                    }
                )
            );
    }

    @Action(HotelOfflineRequest)
    offlineRequest(states: StateContext<hotelbook>, action: HotelOfflineRequest) {

        console.log(states,action);

        // let approveStatus = this.store.selectSnapshot(CompanyState.getApprovalStatus);
        // let manager = approveStatus ? this.store.selectSnapshot(UserState.getApprover) : this.bookingPerson();
        // let mailcc = approveStatus ? action.mailCC : null;
        // let hoteldetail = this.store.selectSnapshot(HotelResultState.getSelectedInventoryHotels)
        // let rmdetail = this.store.selectSnapshot(HotelResultState.getSelectedInventoryRooms);
        // let amenities = rmdetail.reduce((...el) => [...el[1].room_type],[])


        // let req = {
        //     guest_details:
        //         {
        //             passengers: this.store.select(HotelPassengerState.GetSelectAdult),
        //             roomDetails:[
        //                 {
        //                     Price:{},
        //                     Amenity:amenities,
        //                     BedTypes:"",
        //                     NoOfChild:this.store.selectSnapshot(HotelSearchState.getTotalChildren),
        //                     RoomIndex:"",
        //                     NoOfAdults:this.store.selectSnapshot(HotelSearchState.getTotalChildren),
        //                     HotelPassenger:this.store.select(HotelPassengerState.GetSelectAdult)
        //                 }
        //             ],
        //             basiscInfo:
        //                 {
        //                     CityId:"",
        //                     tokenId:null,
        //                     CityName:"chennai",
        //                     HotelCode:"h7",
        //                     HotelName:"hotel1",
        //                     NoOfChild:0,
        //                     NoOfAdults:1,
        //                     NoOfNights:1,
        //                     CheckInDate:"2021-03-12",
        //                     HotelPolicy:"",
        //                     CheckOutDate:"2021-03-13",
        //                     HotelAddress:"",
        //                     TotalBaseFare:1250,
        //                     StarRating:4
        //                 },
        //             servicecharge_details:
        //                 {
        //                     service_charges:0,
        //                     sgst_Charges:0,
        //                     cgst_Charges:0,
        //                     igst_Charges:0,
        //                     total_amount:1250,
        //                     markup_charges:0,
        //                     agency_markup:0
        //                 },
        //             userEligibility:
        //                 {
        //                     company_type:"corporate"
        //                 }
        //             },
        //         hotel_requests:this.store.selectSnapshot(HotelSearchState.getPayload),
        //         transaction_id:"null",
        //         user_id:this.store.selectSnapshot(UserState.getUserId),
        //         customer_id:this.store.selectSnapshot(UserState.getcompanyId),
        //         booking_mode:"offline",
        //         approval_mail_cc:mailcc,
        //         status:"new",
        //         managers:manager,
        //         trip_type:"business",
        //         comments:'[\"' + action.comment + '\"]',
        //         purpose:action.purpose
        //     }

    }

    serviceCharges(): number {
        let serviceCharge: number = 0;
        serviceCharge = this.store.selectSnapshot(CompanyState.getHotelServiceCharge) * this.store.selectSnapshot(HotelSearchState.getGuest);
        return serviceCharge;
    }

    bookingPerson() {
        let users = this.store.selectSnapshot(CompanyState.getEmployees);
        let admins = users.filter(user => user.role == 'admin' && user.is_rightsto_book !== null && user.is_rightsto_book);
        return [admins[0].email];
    }


}