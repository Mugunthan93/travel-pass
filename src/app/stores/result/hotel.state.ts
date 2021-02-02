import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { Observable, from, of, forkJoin, concat } from 'rxjs';
import { mergeMap, take, toArray, catchError, skipWhile, flatMap, map, concatMap } from 'rxjs/operators';
import { SearchHotel, HotelSearchState, staticresponselist, hotelresultlist, staticpayload, paragraph, subsection, hotelForm } from '../search/hotel.state';
import { SharedService } from 'src/app/services/shared/shared.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import * as _ from 'lodash';
import { FileService } from 'src/app/services/file/file.service';
import { AddBlockRoom, passengers } from '../book/hotel.state';
import { Navigate } from '@ngxs/router-plugin';
import { BookMode } from '../book.state';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { GetPlaces, HotelFilterState, hotelFilter } from './filter/hotel.filter.state';
import { CompanyState } from '../company.state';
import { append, insertItem, patch, removeItem } from '@ngxs/store/operators';
import { InventoryRoomsComponent } from 'src/app/components/hotel/inventory-rooms/inventory-rooms.component';
import { UserState } from '../user.state';
import { AddAdultPassenger, AddChildPassenger } from '../passenger/hotel.passenger.state';

export interface hotelresult {
    hotelresponseList: (staticresponselist & hotelresultlist)[]
    hotelList: (staticresponselist & hotelresultlist)[]
    traceId: string
    selectedHotel: selectedHotel
    selectedRoom: hotelDetail[]
    roomCategory : string[]
    listlimit : number
    token: string
    loading: number
    opencombination : hotelDetail[][];
    fixedcombination : hotelDetail [][];
    privateInventory : inventory[]
    inventoryrooms : inventory[]
    selectedinventoryhotel : inventory
    selectedinventoryrooms : inventory[]
}

export interface selectedHotel {
    Error?:Error
    HotelDetail: hotellist
    HotelRoomsDetails: hotelDetail[]
    IsPolicyPerStay: boolean
    IsUnderCancellationAllowed: boolean
    RoomCombinationsArray: roomCombination[]
    resultIndex : number
}

export interface Error {
    ErrorCode: number
    ErrorMessage: string
}

export interface hotelDetail {
    Amenities?: string[]
    Amenity?: string[]
    AvailabilityType?: string
    BedTypes?: any[]
    BedTypeCode? : any
    CancellationPolicies?: cancellationPolicy[]
    CancellationPolicy?: string
    CategoryId?: string
    ChildCount?: number
    DayRates?: dayRates[]
    HotelSupplements?: any[]
    Images?: string
    Inclusion?: string[]
    InfoSource?: string
    IsPANMandatory?: boolean
    IsPassportMandatory?: boolean
    IsPerStay?: boolean
    LastCancellationDate?: string
    LastVoucherDate?: string
    Price?: hotelprice
    RatePlan?: number
    RatePlanCode?: string
    RequireAllPaxDetails?: boolean
    RoomDescription?: string
    RoomId?: number
    RoomIndex?: number
    RoomPromotion?: string
    RoomStatus?: number
    RoomTypeCode?:  string
    RoomTypeName?: string
    SequenceNo?: string
    Supplements? : any
    SmokingPreference?: any
    SupplierPrice?: any
}

export interface cancellationPolicy {
    Charge: number
    ChargeType: number
    Currency: string
    FromDate: string
    ToDate: string

}

export interface dayRates {
    Amount: number
    Date: string
}

export interface roomCombination {
        CategoryId: string
        InfoSource: string
        IsPolicyPerStay: boolean
        RoomCombination: roomindex[]
}

export interface roomindex {
    RoomIndex : number[]
}

export interface getHotelInfo {
    CategoryId: string
    // EndUserIp: "192.168.0.115"
    EndUserIp: string
    HotelCode: string
    ResultIndex: number
    TraceId: string
}

export interface hotelinfoList {
    Address: string
    Attractions: attractions[]
    CountryName: string
    Description: string
    Email: string
    FaxNumber: string
    HotelContactNo: string
    HotelFacilities: string[]
    HotelName: string
    HotelPicture: string
    HotelPolicy: String
    HotelURL: string
    Images: string[]
    Latitude: string
    Longitude: string
    PinCode: string
    RoomData: any
    RoomFacilities: any
    Services: any
    SpecialInstructions: any
    StarRating: number
    ResultIndex?: number
}

export interface attractions {
    key: string
    value : string
}

export interface hotelResponse {
    response: hotelresponse
}

export interface hotelresponse {
    CheckInDate: string
    CheckOutDate: string
    CityId: string
    Error: {
        ErrorCode: number
        ErrorMessage: string
    }
    HotelResults: (staticresponselist & hotelresultlist)[]
    NoOfRooms: number
    PreferredCurrency: string
    ResponseStatus: number
    RoomGuests: any[]
    TraceId: string
}

export interface hotelresponselist{
    HotelAddress: string
    HotelCategory: string
    HotelCode: string
    HotelContactNo: string
    HotelDescription: string
    HotelLocation: string
    HotelMap: string
    HotelName: string
    HotelPicture: string
    HotelPolicy: string
    HotelPromotion: string
    IsTBOMapped: boolean
    Latitude: string
    Longitude: string
    Price: hotelprice
    ResultIndex: number
    RoomDetails: any[]
    StarRating: number
    SupplierHotelCodes: supplierhotelcodes[]
    SupplierPrice: any
}

export interface supplierhotelcodes {
    CategoryId: string
    CategoryIndex: number
}

export interface hotelprice {
    AgentCommission: number
    AgentMarkUp: number
    ChildCharge: number
    CurrencyCode: string
    Discount: number
    ExtraGuestCharge: number
    GST: hotelgst
    OfferedPrice: number
    OfferedPriceRoundedOff: number
    OtherCharges: number
    PublishedPrice: number
    PublishedPriceRoundedOff: number
    RoomPrice: number
    ServiceCharge: number
    ServiceTax: number
    TDS: number
    Tax: number
    TotalGSTAmount: number
}

export interface hotelgst {
    CGSTAmount: number
    CGSTRate: number
    CessAmount: number
    CessRate: number
    IGSTAmount: number
    IGSTRate: number
    SGSTAmount: number
    SGSTRate: number
    TaxableAmount: number
}

export interface hotellist {
    
    HotelAddress?: string
    Address?: string

    HotelDescription?: string
    Description?: string

    HotelPicture?: string
    Images?: string[]

    HotelCode?: string
    HotelName?: string
    HotelCategory?: string
    HotelContactNo?: string
    HotelFacilities?: string[]
    HotelLocation?: string
    HotelMap?: string
    HotelPolicy?: string
    HotelPromotion?: string
    HotelURL?: string

    IsTBOMapped?: boolean
    Price?: hotelprice
    ResultIndex?: number
    StarRating?: number
    SupplierHotelCodes?: supplierhotelcodes[]
    currentSupplier?: supplierhotelcodes
    Attractions?: attractions[]
    CountryName?: string
    PinCode?: string


    Latitude?: string
    Longitude?: string
    RoomDetails?: any[]
    SupplierPrice?: any

    Email?: string
    FaxNumber?: string
    RoomData?: any
    RoomFacilities?: any
    Services?: any
    SpecialInstructions?: any
}

export interface viewPayload {
    CategoryId: string
    EndUserIp: string
    HotelCode: string
    ResultIndex: number
    TokenId: string
    TraceId: string
}

export interface blockRoomPayload {
    HotelRoomsDetails: any[]
    ResultIndex: number
    HotelCode: string
    HotelName: string
    GuestNationality: string
    NoOfRooms: string
    ClientReferenceNo: number
    IsVoucherBooking: string
    CategoryId: string
    EndUserIp: string
    TokenId: any
    TraceId: string
}

export interface inventory {
    id: number,
    hotel_name: string,
    email: string,
    contact_person: string,
    contact_person_email: string,
    star_rating: number,
    city: number,
    cab: boolean,
    cp: boolean,
    map: boolean,
    ap: boolean,
    ep: boolean,
    hotel_code: string,
    cancellation_fee: number,
    contact_number: string,
    contact_person_contact_number: string,
    room_type: string,
    room_id: string,
    price: number,
    customer_id: number,
    createdAt: string,
    updatedAt: string  
}

//////////////////////////////////////////////////////////////////////////

export class HotelResponse {
    static readonly type = "[hotel_result] HotelResponse";
    constructor(public response: hotelresponse) {

    }
}

export class DownloadResult {
    static readonly type = "[hotel_result] DownloadResult";
    constructor(public list : hotelresponselist[]) {

    }
}

export class AddHotels {
    static readonly type = "[hotel_result] AddHotels";
    constructor() {

    }
}

export class ViewHotel {
    static readonly type = "[hotel_result] ViewHotel";
    constructor(public hotel: hotellist, public modal: Observable<void>) {

    }
}

export class AddRoom {
    static readonly type = "[hotel_result] AddRoom";
    constructor(public room: hotelDetail) {

    }
}

export class RemoveRoom {
    static readonly type = "[hotel_result] RemoveRoom";
    constructor(public room: hotelDetail) {

    }
}

export class GetToken {
    static readonly type = '[hotel_result] GetToken';
}

export class BlockRoom {
    static readonly type = "[hotel_result] BlockRoom";
}

export class GetImage {
    static readonly type = "[hotel_result] GetImage";
    constructor(public code: string) {

    }
}

export class SetLoading {
    static readonly type = "[hotel_result] SetLoading";
    constructor(public num: number) {

    }
}

export class ResetRoom{
    static readonly type = "[hotel_result] ResetRoom";
}

export class GetPrivateInventory {
    static readonly type = "[hotel_result] GetPrivateInventory";
}

export class SelectInventoryHotel {
    static readonly type = "[hotel_result] SelectInventoryHotel";
    constructor(public invhotel: inventory) {

    }
}

export class AddInventoryRooms {
    static readonly type = "[hotel_result] SetInventoryRooms";
    constructor(public invrooms: inventory) {

    }
}

export class RemoveInventoryRooms {
    static readonly type = "[hotel_result] RemoveInventoryRooms";
    constructor(public invrooms: inventory) {

    }
}

export class SendInventory {
    static readonly type = "[hotel_result] SendInventory";
}

@State<hotelresult>({
    name: 'hotel_result',
    defaults: {
        hotelresponseList: [],
        hotelList :[],
        traceId: null,
        selectedHotel: null,
        selectedRoom: [],
        listlimit : 10,
        token: null,
        roomCategory: ['all'],
        loading:0,
        opencombination : [],
        fixedcombination : [],
        privateInventory : [],
        inventoryrooms : [],
        selectedinventoryhotel : null,
        selectedinventoryrooms : []
    }
})

export class HotelResultState{

    constructor(
        private store: Store,
        private file : File,
        private hotelService: HotelService,
        private fileService : FileService,
        public loadingCtrl: LoadingController,
        private sharedService: SharedService,
        public modalCtrl: ModalController,
        public domSantizier: DomSanitizer,
        public alertCtrl : AlertController
    ) {

    }

    @Selector()
    static getToken(state: hotelresult) : string {
        return state.token;
    }

    @Selector()
    static getLoading(state: hotelresult) : number {
        return state.loading;
    }

    @Selector([HotelFilterState])
    static getHotelList(state: hotelresult, filter: hotelFilter): (staticresponselist & hotelresultlist)[] {
        return state.hotelList.filter(
            el => 
                (filter.starRating !== -1 ? el.StarRating == filter.starRating : el) &&
                (filter.price == 0 ? el : filter.price >= el.Price.PublishedPrice) &&
                (
                    filter.place.some(air => air.value == true) ?
                    filter.place.some(air => (air.name === el.Place) && (air.value)) : el
                )
        );
    }

    @Selector()
    static getHotelLength(state: hotelresult): number {
        return state.hotelresponseList.length;
    }

    @Selector()
    static getResponselList(state: hotelresult): (staticresponselist & hotelresultlist)[]  {
        return state.hotelresponseList;
    }

    @Selector()
    static getSelectedHotel(states: hotelresult): selectedHotel {
        return states.selectedHotel;
    }

    @Selector()
    static getLimit(states: hotelresult): number {
        return states.listlimit;
    }

    @Selector()
    static getAboutHotel(states: hotelresult) : string {
        return states.selectedHotel.HotelDetail.Description;
    }

    @Selector()
    static totalResult(states: hotelresult): number {
        return states.hotelresponseList.length + states.privateInventory.length;
    }

    @Selector()
    static getCategory(states : hotelresult) : string[] {
        return states.roomCategory;
    }

    @Selector()
    static getRoomDetail(states: hotelresult): hotelDetail[] {
        return states.selectedHotel.HotelRoomsDetails;
    }

    @Selector()
    static getSelectedRoom(states: hotelresult): hotelDetail[] {
        return states.selectedRoom
    }

    
    @Selector()
    static getHotelCode(states: hotelresult) : string {
        return states.selectedHotel.HotelDetail.HotelCode
    }

    @Selector()
    static getOpenCombination(states : hotelresult) {
        return states.opencombination;
    }

    @Selector()
    static getFixedCombination(states : hotelresult) {
        return states.fixedcombination;
    }

    @Selector()
    static getInventoryList(states : hotelresult) {
        return states.privateInventory;
    }

    @Selector()
    static getSelectedInventoryHotels(states : hotelresult) {
        return states.selectedinventoryhotel;
    }

    @Selector()
    static getInventoryRooms(states : hotelresult) {
        return states.inventoryrooms.filter(el => el.hotel_name == states.selectedinventoryhotel.hotel_name);
    }

    @Selector()
    static getSelectedInventoryRooms(states : hotelresult) {
        return states.selectedinventoryrooms;
    }
    
    @Action(ResetRoom)
    resetRoom(states: StateContext<hotelresult>) {
        states.patchState({
            selectedRoom : []
        });
    }

    @Action(SetLoading)
    setLoading(states: StateContext<hotelresult>, action: SetLoading) {
        states.patchState({
            loading : action.num
        });
    }

    @Action(AddInventoryRooms)
    addInventoryRooms(states: StateContext<hotelresult>, action: AddInventoryRooms) {
        states.setState(patch({
            selectedinventoryrooms : append([action.invrooms])
        }));
    }

    @Action(RemoveInventoryRooms)
    removeInventoryRooms(states: StateContext<hotelresult>, action: RemoveInventoryRooms) {
        states.setState(patch({
            selectedinventoryrooms : removeItem<inventory>(el => _.isEqual(el,action.invrooms))
        }));
    }

    @Action(SelectInventoryHotel)
    selectInventoryHotel(states: StateContext<hotelresult>, action: SelectInventoryHotel) {
        states.patchState({
            selectedinventoryhotel : action.invhotel
        });

        let modal$ = from(this.modalCtrl.create({
            component : InventoryRoomsComponent
        })).pipe(flatMap((el) => from(el.present())));

        return modal$;
    }

    @Action(SendInventory)
    sendInventory(states: StateContext<hotelresult>, action: SendInventory) {

        console.log(action);

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

        states.dispatch([
            new BookMode('hotel'),
            new Navigate(['/', 'home', 'book', 'hotel'])
        ])

        return from(this.modalCtrl.dismiss());
    }

    @Action(GetToken)
    getToken(states: StateContext<hotelresult>) {
        return from(this.sharedService.getToken())
            .pipe(
                map(
                    (response: HTTPResponse) => {
                        console.log(response.data);
                        states.patchState({
                            token: JSON.parse(response.data).TokenId
                        });
                    }
                ),
                catchError(
                    (err) => {
                        console.log(err);
                        return of(err);
                    }
                )
            );
    }

    @Action(GetPrivateInventory)
    getPrivateInventory(states: StateContext<hotelresult>) {

        let companyId : string = this.store.selectSnapshot(CompanyState.getId).toString();
        return this.hotelService.getPrivateInventory(companyId)
            .pipe(
                map(
                    (response) => {
                        console.log(response);
                        let data : inventory[] = JSON.parse(response.data);
                        let hotels : any[] = _.uniqBy(data,el => el.hotel_name);
                        states.setState(patch({
                            privateInventory : hotels,
                            inventoryrooms : data
                        }));
                    }
                )
            );
    }

    @Action(HotelResponse,{cancelUncompleted : true})
    getHotelResponse(states: StateContext<hotelresult>, action: HotelResponse) {
        let priceSortedResult: (staticresponselist & hotelresultlist)[] = _.sortBy(action.response.HotelResults, (o) => {
            return o.Price.PublishedPrice;
        });
        states.patchState({
            hotelresponseList: priceSortedResult,
            traceId: action.response.TraceId
        });
        let x : number = 1 / priceSortedResult.length;
        let resultarray: (staticresponselist & hotelresultlist)[][] = _.chunk(priceSortedResult, 10);
        console.log(resultarray);
        return from(resultarray)
            .pipe(
                concatMap(
                    (result) => {
                        return from(result)
                            .pipe(
                                mergeMap(
                                    (hotelObj) => {
                                        let result = Object.assign({}, hotelObj);
                                        let currentCity: string = this.store.selectSnapshot(HotelSearchState.getCityId);
                                        let staticPay: staticpayload = {
                                            CityId: currentCity,
                                            HotelId: result.HotelCode,
                                            ClientId: "ApiIntegrationNew",
                                            EndUserIp: "192.168.0.105"
                                        }
                                        let dumpResponse$ = this.hotelService.getStaticData(staticPay);
                                        return dumpResponse$.
                                            pipe(
                                                skipWhile(el => el.status == -4 || el.status == -2),
                                                map(
                                                    (response: HTTPResponse) => {
                                                        console.log(response);
                                                        let currentX = states.getState().loading + x;
                                                        states.patchState({
                                                            loading: currentX
                                                        });
                                                        let hotelDetail: (staticresponselist & hotelresultlist) = JSON.parse(response.data).ArrayOfBasicPropertyInfo.BasicPropertyInfo;
                                                        result.Place = this.hotelPlace(hotelDetail);
                                                        result.Description = this.hotelDesc(hotelDetail);
                                                        let Images: any[] = this.hotelImg(hotelDetail);
                                                        let filteredImg: string[] = Images.filter(el => _.isString(el));
                                                        result.Images = filteredImg;
                                                        console.log(result);
                                                        return result;
                                                    }
                                                )
                                            );
                                }),
                                toArray(),
                                map(
                                    (el) => {
                                        let uniqArr : (staticresponselist & hotelresultlist)[] = _.uniqWith(el, _.isEqual);
                                        console.log(uniqArr);
                                        return uniqArr;
                                    }
                                )
                            )
                    }
                ),
                toArray(),
                map(
                    (result) => {
                        let flatresult = result.flat();
                        states.dispatch(new GetPlaces(flatresult));
                        let currentX = states.getState().loading;
                        states.patchState({
                            loading: currentX,
                            hotelList: flatresult
                        });
                    }
                )
            )
    }

    @Action(AddHotels)
    addHotels(states: StateContext<hotelresult>) {
        let currentCount: number = states.getState().listlimit + 10;
        states.patchState({
            listlimit: currentCount
        });
    }

    @Action(ViewHotel,{cancelUncompleted : true})
    viewHotel(states: StateContext<hotelresult>, action: ViewHotel) {

        const loading$ = from(this.loadingCtrl.create({
            spinner: "crescent",
            id: 'retrive-hotel'
        }))
        .pipe(
            flatMap(
                (loadingEl) => {
                    loadingEl.message = "Retrieving Hotel Details";
                    return from(loadingEl.present());
                }
            )
        );

        const noroom$ = from(this.alertCtrl.create({
            header: 'Room Failed',
            message : 'No room Available now, Try other Hotels',
            buttons : [
                {
                    text : 'Ok',
                    handler : () => {
                        return true;
                    }
                }
            ]
        })).pipe(flatMap(el => from(el.present())));

        states.dispatch(new GetToken());
        const token: string = states.getState().token;

        let hotelcategory = action.hotel.SupplierHotelCodes[0].CategoryId;

        const viewPayload: viewPayload = {
            EndUserIp: "192.168.0.115",
            TokenId: token,
            TraceId: states.getState().traceId,
            ResultIndex: action.hotel.ResultIndex,
            HotelCode: action.hotel.HotelCode,
            CategoryId: hotelcategory
        }

        const viewhotel$ = this.hotelService.viewHotel(viewPayload)
            .pipe(
                skipWhile(
                    (response : HTTPResponse) => {
                        let hotelResponse: selectedHotel = JSON.parse(response.data).response;
                        //trace ID expired
                        if (hotelResponse.Error.ErrorCode == 6) {
                            let payload: hotelForm = this.store.selectSnapshot(HotelSearchState.getSearchData);
                            states.dispatch(new SearchHotel(payload));
                            return true;
                        }
                        else if (hotelResponse.Error.ErrorCode == 2) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                ),
                map(
                    (response: Observable<void> | HTTPResponse) => {
                        let hotelResponse: selectedHotel = JSON.parse((response as HTTPResponse).data).response;
                        if (hotelResponse.Error.ErrorCode == 2) {
                            return noroom$;
                        }
                        else {
                            return response;
                        }
                    }
                ),
                map(
                    (response: Observable<void> | HTTPResponse) => {

                        console.log(response);
                        let hotelResponse: selectedHotel = JSON.parse((response as HTTPResponse).data).response;
                        let roomDetail = hotelResponse.HotelRoomsDetails.map(
                            (detail) => {
                                return _.omitBy(detail, (val) => {
                                    return _.isNull(val) ||
                                        (_.isString(val) && val.length < 1) ||
                                        (_.isArray(val) && val.length < 1);
                                })
                            }
                        );

                        roomDetail = _.filter(roomDetail, (n) => {
                            return !_.isUndefined(n.DayRates) && n.CategoryId == hotelcategory;
                        });

                        roomDetail = _.uniqBy(roomDetail, 'RoomIndex');
                        let selected: selectedHotel = Object.assign({}, {
                            HotelDetail: action.hotel,
                            HotelRoomsDetails: roomDetail,
                            IsPolicyPerStay: hotelResponse.IsPolicyPerStay,
                            IsUnderCancellationAllowed: hotelResponse.IsUnderCancellationAllowed,
                            RoomCombinationsArray: hotelResponse.RoomCombinationsArray,
                            resultIndex: action.hotel.ResultIndex
                        });
                        return selected;
                    }
                ),
                flatMap(
                    (hotelObj) => {
                        let hotel = Object.assign({}, hotelObj);
                        let category: string[] = Object.assign([], states.getState().roomCategory);

                        let roomDetail = Object.assign([], hotel.HotelRoomsDetails);
                        roomDetail.forEach(
                            (el) => {
                                if (el.Amenities) {
                                    let amen: string = _.lowerCase(el.Amenities[0]);
                                    category.push(amen);
                                }
                            }
                        );
                        category = _.uniq(category);

                        states.patchState({
                            roomCategory: category
                        });

                        let imgRoomDetail = roomDetail.map(
                            (el) => {
                                let randomNum: number = Math.floor(Math.random() * Math.floor(hotel.HotelDetail.Images.length));
                                let currentEl = Object.assign({}, el);
                                currentEl.Images = hotel.HotelDetail.Images[randomNum];
                                return currentEl;
                            }
                        );

                        hotel.HotelRoomsDetails = Object.assign([], imgRoomDetail);
                        console.log(hotel);

                        let open = this.combination(hotel,'OpenCombination',hotelcategory);
                        let fixed = this.combination(hotel,'FixedCombination',hotelcategory);
                        console.log(open,fixed);

                        states.patchState({
                            selectedHotel: hotel,
                            opencombination : open,
                            fixedcombination : fixed
                        });
                        return concat(from(this.loadingCtrl.dismiss(null, null, 'retrive-hotel')),action.modal);
                    }
                )
            );

            
        if (_.isNull(states.getState().selectedHotel)) {
            return forkJoin(loading$, viewhotel$);
        }
        else {
            let samehotel: boolean = action.hotel.ResultIndex == states.getState().selectedHotel.HotelDetail.ResultIndex;
            if (samehotel) {
                states.patchState({
                    selectedRoom: []
                });
                return action.modal;
            }
            else {
                return forkJoin(loading$, viewhotel$);
            }
        }

    }

    @Action(AddRoom)
    addRoom(states: StateContext<hotelresult>, action: AddRoom) {
        states.setState(patch({
            selectedRoom : insertItem(action.room)
        }));
    }

    @Action(RemoveRoom)
    removeRoom(states: StateContext<hotelresult>, action: RemoveRoom) {
        states.setState(patch({
            selectedRoom: removeItem((el : hotelDetail) => el.RoomIndex == action.room.RoomIndex)
        }));
    }

    @Action(BlockRoom)
    blockRoom(states: StateContext<hotelresult>) {

        let searchroomlength: number = this.store.selectSnapshot(HotelSearchState.getRooms).length;
        let addedroomlength: number = states.getState().selectedRoom.length;

        let roomAlert$: Observable<void> = from(this.alertCtrl.create({
            header: 'Rooms Exceed',
            subHeader: 'Check Room Detail',
            message: 'you have selected ' + searchroomlength + ' rooms but added ' + addedroomlength + ' rooms',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        return true;
                    }
                }
            ]
        })).pipe(
            map(
                (alertEl) => {
                    alertEl.present();
                }
            )
        );

        let selectionAlert$ = from(this.alertCtrl.create({
            header: 'Rooms Selection',
            subHeader: 'Select the Room',
            message: 'you have selected ' + addedroomlength + ' rooms out of ' + searchroomlength + ' rooms',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        return true;
                    }
                }
            ]
        })).pipe(
            flatMap(
                (alertEl) => {
                    console.log(alertEl);
                    return from(alertEl.present());
                }
            )
        );

        if (addedroomlength !== 0) {

            return from(this.loadingCtrl.create({
                spinner: "crescent",
                id: 'search-hotel'
            })).pipe(
                flatMap(
                    (loadingEl) => {
                        loadingEl.message = "processing for booking....";
                        loadingEl.present();
                        let room: hotelDetail[] = Object.assign([],states.getState().selectedRoom);
                        let pickedRooms: any = room.map(
                            (detail: hotelDetail) => {
                                let el: hotelDetail = Object.assign({},detail);
                                if (_.isUndefined(el.BedTypeCode)) {
                                    el.BedTypeCode = null;
                                }
                                if (_.isUndefined(el.Supplements)) {
                                    el.Supplements = null;
                                }
                                if (el.SmokingPreference == "NoPreference") {
                                    el.SmokingPreference = 0;
                                }
                                el = _.pick(el, [
                                    'RoomIndex',
                                    'RoomTypeCode',
                                    'RoomTypeName',
                                    'RatePlanCode',
                                    'BedTypeCode',
                                    'SmokingPreference',
                                    'Supplements',
                                    'Price'
                                ]);
                                return el;
                            }
                        );
                        console.log(pickedRooms);
                        let blockpayload: blockRoomPayload = {
                            HotelRoomsDetails: pickedRooms,
                            ResultIndex: states.getState().selectedHotel.HotelDetail.ResultIndex,
                            HotelCode: states.getState().selectedHotel.HotelDetail.HotelCode,
                            HotelName: states.getState().selectedHotel.HotelDetail.HotelName,
                            GuestNationality: this.store.selectSnapshot(HotelSearchState.getNationality),
                            NoOfRooms: states.getState().selectedRoom.length.toString(),
                            ClientReferenceNo: 0,
                            IsVoucherBooking: 'true',
                            CategoryId: states.getState().selectedRoom[0].CategoryId,
                            EndUserIp: '192.168.0.115',
                            TokenId: null,
                            TraceId: states.getState().traceId
                        }
                        console.log(JSON.stringify(blockpayload));
                
                        let blockroom$ = from(this.hotelService.blockHotel(blockpayload))
                        .pipe(
                                skipWhile(
                                    (response : HTTPResponse) => {
                                        console.log(response);
                                        let blockedRoom: any = JSON.parse(response.data).response;
                                        if (blockedRoom.Error.ErrorCode == 2) {
                                            return true;
                                        }
                                        return false;
                                    }
                                ),
                                flatMap(
                                    (response: HTTPResponse) => {
                                        console.log(response);
                                        let blockedRoom: any = JSON.parse((response as HTTPResponse).data).response;
                                        if (blockedRoom.Error.ErrorCode == 2) {
                                            return concat(from(loadingEl.dismiss()),this.errorAlert(blockedRoom.Error.ErrorCode));
                                        }
                                        return concat(
                                            states.dispatch(new AddBlockRoom(blockedRoom)),
                                            from(this.modalCtrl.dismiss(null, null, 'view-room')),
                                            from(this.modalCtrl.dismiss(null, null, 'view-hotel')),
                                            states.dispatch(new BookMode('hotel')),
                                            states.dispatch(new Navigate(['/', 'home', 'book', 'hotel'])),
                                            from(loadingEl.dismiss())
                                        );
                                    }
                                )
                            )
                
                        if(searchroomlength == addedroomlength) {
                            return blockroom$;
                        }
                        else {
                            return concat(from(loadingEl.dismiss()),roomAlert$);
                        }
                    }
                )
            );

        }
        else {
            return selectionAlert$;
        }

        
    }

    hotelPlace(hotelObj: staticresponselist & hotelresultlist) {
        if (hotelObj.VendorMessages && Array.isArray(hotelObj.VendorMessages.VendorMessage)) {
            const fairRuleTemplate = hotelObj.VendorMessages.VendorMessage.map(
                (el) => {
                    if (el.InfoType == '1') {
                        if (Array.isArray(el.SubSection)) {
                            return el.SubSection[0].Paragraph.Text.$t;
                        }
                        else {
                            return (el.SubSection as unknown as subsection).Paragraph.Text.$t;
                        }
                    }
                }
            );
            let sanitizedTemplate = this.domSantizier.sanitize(SecurityContext.HTML, fairRuleTemplate);
            sanitizedTemplate = _.trim(sanitizedTemplate, ',,,');
            let headline = sanitizedTemplate.match(/<p>(.*?)<\/p>/g);
            if (headline !== null) {
                let val1 = headline.map(el => el.replace(/<\/?p>/g, ''))[0]
                let val2 = _.trim(val1).match(/:(.*)/);
                if (val2 !== null) {
                    return _.trim(val2[1]);
                }
                else {
                    return null;
                }
            }
            else {
                return  null;
            }
        }
        else {
            return null;
        }
    }

    hotelDesc(hotelObj: staticresponselist & hotelresultlist) {
        if (hotelObj.VendorMessages && Array.isArray(hotelObj.VendorMessages.VendorMessage)) {
            const fairRuleTemplate = hotelObj.VendorMessages.VendorMessage.map(
                (el) => {
                    if (el.InfoType == '1') {
                        if (Array.isArray(el.SubSection)) {
                            return el.SubSection[0].Paragraph.Text.$t;
                        }
                        else {
                            return (el.SubSection as unknown as subsection).Paragraph.Text.$t;
                        }
                    }
                }
            );
            let sanitizedTemplate = this.domSantizier.sanitize(SecurityContext.HTML, fairRuleTemplate);
            sanitizedTemplate = _.trim(sanitizedTemplate, ',,,');
            return sanitizedTemplate
        }
        else {
            return null;
        }
    }

    hotelImg(hotel: staticresponselist & hotelresultlist) : string[]{
        if (hotel.VendorMessages && Array.isArray(hotel.VendorMessages.VendorMessage)) {
            return _.uniq(_.compact(hotel.VendorMessages.VendorMessage.flatMap(
                (vendor) => {
                    if (vendor.InfoType == "23") {
                        if (Array.isArray(vendor.SubSection)) {
                            return vendor.SubSection.flatMap(
                                (section) => {
                                    if (Array.isArray(section.Paragraph)) {
                                        return section.Paragraph.flatMap(
                                            (para) => {
                                                return para.URL;
                                            }
                                        );
                                    }
                                    else {
                                        return (section.Paragraph as paragraph).URL;
                                    }
                                }
                            );
                        }
                        else {
                            return (vendor.SubSection as subsection).Paragraph.URL;
                        }
                    }
                }
            )));
        }
        else {
            return [hotel.HotelPicture];
        }
    }

    checkImg(filteredImg: string[], result: staticresponselist & hotelresultlist) {
        if (filteredImg.length > 0) {
            let url: string = filteredImg[0];
            let splitedEl: string[] = filteredImg[0].split('/');

            let folderName: string = result.HotelCode;
            let folderPath: string = 'TravellersPass/Image/Hotel';

            let fileName: string = splitedEl[splitedEl.length - 1];
            let filePath: string = null;
            if (fileName.includes('.jpg')) {
                filePath = folderPath + '/' + folderName + '/' + fileName;
            }
            else {
                filePath = folderPath + '/' + folderName + '/' + fileName + '.jpg';
            }
            return this.fileService.checkFile(filePath, fileName)
                .pipe(
                    map(
                        () => {
                            filteredImg[0] = this.file.externalRootDirectory + filePath;
                            return filteredImg;
                        }
                    ),
                    catchError(
                        () => {
                            return this.fileService.downloadFile(url, filePath)
                                .pipe(
                                    map(
                                        (files: FileEntry) => {
                                            let str: string = files.fullPath;
                                            filteredImg[0] = this.file.externalRootDirectory + str;
                                            return filteredImg;
                                        }
                                    ),
                                    catchError(
                                        () => {
                                            filteredImg[0] = "";
                                            return filteredImg;
                                        }
                                    )
                                )
                        }
                    )
                )
        }
        else {
            filteredImg = [result.HotelPicture];
            return of(filteredImg);
        }
    }

    errorAlert(message) {
        return from(this.alertCtrl.create({
            header: 'Rooms Book Failed',
            subHeader: 'Failed to book the room',
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        return true;
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
    }

    combination(hotel : selectedHotel,type : string,category : string) {
        let open = hotel.RoomCombinationsArray
            .filter(o => o.CategoryId == category && o.InfoSource == type);
            
        if(open.length > 0) {
            let openIndex = open.flatMap(o => o.RoomCombination.map(el => el.RoomIndex.map(e => hotel.HotelRoomsDetails.find(rm => rm.RoomIndex == e))));
            return openIndex;
        }
        else {
            return [];
        }
        
    }
}