import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { File, FileError, FileEntry, DirectoryEntry } from '@ionic-native/file/ngx';
import { FileTransferObject, FileTransfer, FileTransferError } from '@ionic-native/file-transfer/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable, from, throwError, of, EMPTY } from 'rxjs';
import { mergeMap, take, toArray, tap, catchError, skipWhile, takeWhile, flatMap, map, switchMap, exhaustMap, retryWhen, delayWhen, finalize, concatMap, ignoreElements, skip, find } from 'rxjs/operators';
import { SearchHotel, HotelSearchState } from '../search/hotel.state';
import { SharedService } from 'src/app/services/shared/shared.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import * as _ from 'lodash';
import { FileService } from 'src/app/services/file/file.service';
import { AddBlockRoom } from '../book/hotel.state';
import { Navigate } from '@ngxs/router-plugin';
import { BookMode } from '../book.state';

export interface hotelresult {
    hotelresponseList: hotelresponselist[]
    hotelList: hotellist[]
    traceId: string
    selectedHotel: selectedHotel
    selectedRoom: hotelDetail[]
    roomCategory : string[]
    listlimit : number
    token: string
}

export interface selectedHotel {
    HotelDetail: hotellist
    HotelRoomsDetails: hotelDetail[]
    IsPolicyPerStay: boolean
    IsUnderCancellationAllowed: boolean
    RoomCombinationsArray: roomCombination[]
    resultIndex : number
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
    Images?: string[]
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
    HotelResults: hotelresponselist[]
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
    CategoryIndexes: number[]
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
    constructor(public hotel: hotellist) {

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
        roomCategory:['all']
    }
})

export class HotelResultState{

    constructor(
        private store : Store,
        private file : File,
        private hotelService: HotelService,
        private fileService : FileService,
        public loadingCtrl: LoadingController,
        private sharedService: SharedService,
        public modalCtrl : ModalController
    ) {

    }

    @Selector()
    static getHotelList(state: hotelresult): hotellist[] {
        return state.hotelList;
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
        return states.hotelresponseList.length;
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

    @Action(GetToken)
    getToken(states: StateContext<hotelresult>) {

        return from(this.sharedService.getToken())
            .pipe(
                map(
                    (response: HTTPResponse) => {
                        console.log(response.data);
                        states.patchState({
                            token: response.data.TokenId
                        });
                    }
                ),
                catchError(
                    (err) => {
                        console.log(err);
                        return err;
                    }
                )
            );
    }

    @Action(HotelResponse)
    getHotelResponse(states: StateContext<hotelresult>, action: HotelResponse) {

        let filteredhotelresult = action.response.HotelResults
            .filter(el => !_.isUndefined(el.SupplierHotelCodes));

        let limit: number = states.getState().listlimit;
        
        return from(filteredhotelresult)
            .pipe(
                map(
                    (hotel: hotelresponselist) => {
                        let omitedVal = _.omitBy(hotel, (val) => {
                            return _.isNull(val) ||
                                (_.isString(val) && val.length < 1) ||
                                (_.isString(val) && val == "https://images.cdnpath.com/Images/HotelNA.jpg") ||
                                (_.isArray(val) && val.length < 1);
                        });
                        return omitedVal;
                    }
                ),
                toArray(),
                map(
                    (result: hotelresponselist[]) => {
                        states.patchState({
                            hotelresponseList: result,
                            traceId: action.response.TraceId
                        });
                        return _.sortBy(result, (o) => {
                            return o.Price.PublishedPrice;
                        }).slice(0,10);
                    }
                ),
                tap(
                    (hotels) => {
                        console.log(hotels);
                        states.dispatch(new DownloadResult(hotels));
                })
            )

    }
        

    @Action(DownloadResult)
    downloadresult(states: StateContext<hotelresult>, action: DownloadResult) : Observable<void> {

        return from(action.list)
            .pipe(
                mergeMap(
                    (el: hotelresponselist) => {
                        console.log(el);
                        let traceId: string = states.getState().traceId;
                        let currentState: hotellist[] = states.getState().hotelList;

                        if (currentState.some(hotel => hotel.ResultIndex == el.ResultIndex)) {
                            return of(currentState.find(hotel => hotel.ResultIndex == el.ResultIndex));
                        }
                        return from(el.SupplierHotelCodes)
                            .pipe(
                                takeWhile(el => el.CategoryIndex == 1),
                                mergeMap(
                                    (supply: supplierhotelcodes) => {

                                        console.log(supply);

                                        let hotelInfo = {
                                            CategoryId: supply.CategoryId,
                                            EndUserIp: "192.168.0.115",
                                            HotelCode: el.HotelCode,
                                            ResultIndex: el.ResultIndex,
                                            TraceId: traceId
                                        }

                                        return from(this.hotelService.getHotelInfo(hotelInfo))
                                            .pipe(
                                                skipWhile((HTTPResponse: HTTPResponse) => {

                                                    //Trace Expired
                                                    if (JSON.parse(HTTPResponse.data).response.Error.ErrorCode == 6) {
                                                        states.dispatch(new SearchHotel());
                                                        return true;
                                                    }

                                                    //No rooms Available from UAPI
                                                    if (JSON.parse(HTTPResponse.data).response.Error.ErrorCode == 2) {
                                                        console.log(JSON.parse(HTTPResponse.data).response);
                                                        return true;
                                                    }
                                                    
                                                    //Search Timeout, Try Again
                                                    if (JSON.parse(HTTPResponse.data).response.Error.ErrorCode == -4) {
                                                        console.log(JSON.parse(HTTPResponse.data).response);
                                                        return true;
                                                    }

                                                    //proxy error
                                                    if (HTTPResponse.status == 502) {
                                                        return true;
                                                    }

                                                    return false;

                                                    //maintainance - 503
                                                    //forbidden - 403

                                                }),
                                                map(
                                                    (supplyResponse: HTTPResponse) => {

                                                        let hotelData: hotelinfoList = JSON.parse(supplyResponse.data).response.HotelDetails;
                                                        let omitedVal = _.omitBy(hotelData, (val) => {
                                                            return _.isNull(val) || (_.isString(val) && val.length < 1) ||
                                                                (_.isString(val) && val == "https://images.cdnpath.com/Images/HotelNA.jpg") ||
                                                                (_.isArray(val) && val.length < 1);
                                                        });

                                                        let mergeObj: hotellist = _.merge(omitedVal, el);
                                                        mergeObj.currentSupplier = supply;
                                                        return mergeObj;
                                                    }
                                                ),
                                                flatMap((hotel) => this.checkDir(hotel)),
                                                flatMap(
                                                    (hotel) => {
                                                        if (!_.isUndefined(hotel.Images)) {
                                                            return this.getImages(hotel);
                                                        }
                                                        return of(hotel);
                                                    }
                                                )
                                            )
                                    }
                                ),
                                toArray(),
                                flatMap(
                                    (hotels: hotellist[]) => {
                                        console.log(hotels);
                                        return hotels;
                                    }
                                )
                            );
                    }
                ),
                toArray(),
                map(
                    (hotel) => {
                        console.log(hotel);
                        states.patchState({
                            hotelList: hotel
                        });
                    }
                ),
                finalize(
                    () => {
                        console.log("download result finished");
                    }
                )
            )
    }

    @Action(AddHotels)
    addHotels(states: StateContext<hotelresult>, action: AddHotels): Observable<{ scroll : string}> {

        let currentCount: number = states.getState().listlimit;
        return of(currentCount)
            .pipe(
                exhaustMap(
                    (count: number) => {
                        return from(states.getState().hotelresponseList)
                            .pipe(
                                take(count + 10),
                                toArray(),
                                tap(
                                    (hotels: hotelresponselist[]) => {
                                        states.dispatch(new DownloadResult(hotels));
                                    }
                                )
                            ) 
                    }
                ),
                tap(
                    () => {
                        states.patchState({
                            listlimit: currentCount + 10
                        });
                    }
                ),
                map(
                    (el) => {
                        return {
                            scroll: 'finished'
                        }
                    }
                )
            )
    }

    @Action(ViewHotel)
    viewHotel(states: StateContext<hotelresult>, action: ViewHotel) {

        return of(action.hotel)
            .pipe(
                skipWhile(hotel => {
                    let skip: boolean = false;
                    if (!_.isNull(states.getState().selectedHotel)) {
                        if (hotel.ResultIndex == states.getState().selectedHotel.HotelDetail.ResultIndex) {
                            skip = true;
                        }
                    }
                    return skip;
                }),
                map(
                    (hotel: hotellist) => {
                        states.dispatch(new GetToken());
                        const token: string = states.getState().token;
                        // let indexes: number[] = [];

                        // hotel.SupplierHotelCodes.forEach(
                        //     (code) => {
                        //         indexes.push(code.CategoryIndex);
                        //     }
                        // );

                        const viewPayload: viewPayload = {
                            CategoryIndexes: [1],
                            EndUserIp: "192.168.0.115",
                            HotelCode: action.hotel.HotelCode,
                            ResultIndex: action.hotel.ResultIndex,
                            TokenId: token,
                            TraceId: states.getState().traceId
                        }
                        return from(this.hotelService.viewHotel(viewPayload));
                    }
                ),
                flatMap(
                    (response) => {
                        return response;
                    }
                ),
                map(
                    (response: HTTPResponse) => {
                        console.log(response);
                        let hotelResponse: selectedHotel = JSON.parse(response.data).response;

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
                            return !_.isUndefined(n.DayRates);
                        });

                        let selected: selectedHotel = Object.assign({}, {
                            HotelDetail: action.hotel,
                            HotelRoomsDetails: roomDetail,
                            IsPolicyPerStay: hotelResponse.IsPolicyPerStay,
                            IsUnderCancellationAllowed: hotelResponse.IsUnderCancellationAllowed,
                            RoomCombinationsArray: hotelResponse.RoomCombinationsArray,
                            resultIndex: action.hotel.ResultIndex
                        });

                        states.patchState({
                            selectedHotel: selected
                        });

                        return selected;
                    }
                ),
                map(
                    (hotel: selectedHotel) => {
                        let category: string[] = Object.assign([], states.getState().roomCategory);
                        hotel.HotelRoomsDetails.forEach(
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

                        hotel.HotelRoomsDetails.forEach(
                            (el) => {
                                el.Images = hotel.HotelDetail.Images;
                            }
                        );

                        console.log(hotel);

                        return hotel;
                    }
                ),
                catchError(
                    (error) => {
                        console.log(error);
                        return error;
                    }
                )
            )
    }

    @Action(AddRoom)
    addRoom(states: StateContext<hotelresult>, action: AddRoom) {
        let rooms = Object.assign([], states.getState().selectedRoom);
        let num = this.store.selectSnapshot(HotelSearchState.getRooms).length;

        for (let i = 0; i < num;i ++) {
            rooms.push(action.room);    
        }

        states.patchState({
            selectedRoom : rooms
        });
    }

    @Action(RemoveRoom)
    removeRoom(states: StateContext<hotelresult>, action: RemoveRoom) {
        if (states.getState().selectedRoom.length >= 1) {
            let rooms = Object.assign([], states.getState().selectedRoom);
            let filtered = rooms.filter(el => el.RoomIndex !== action.room.RoomIndex);
            states.patchState({
                selectedRoom: filtered
            });
        }
    }

    @Action(BlockRoom)
    blockRoom(states: StateContext<hotelresult>) {

        let room: hotelDetail[] = states.getState().selectedRoom;

        let pickedRooms : any = room.map(
            (el: hotelDetail) => {

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

        console.log(blockpayload);

        return from(this.hotelService.blockHotel(blockpayload))
            .pipe(
                tap(
                    (response: HTTPResponse) => {
                        console.log(response);
                        let blockedRoom: any = JSON.parse(response.data).response;
                        states.dispatch(new AddBlockRoom(blockedRoom));
                        this.modalCtrl.dismiss(null, null, 'view-room');
                        this.modalCtrl.dismiss(null, null, 'view-hotel');

                        states.dispatch(new BookMode('hotel'));

                        states.dispatch(new Navigate(['/','home','book','hotel']));
                        return of(response);
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

    customizedObj(desObj: hotelinfoList, srcObj : hotelresponselist) {
        if (_.isUndefined(desObj)) {
            return srcObj;
        }
        else if (_.isUndefined(srcObj)) {
            return desObj;
        }

        if (_.isNull(desObj)) {
            return srcObj;
        }
        else if (_.isNull(srcObj)) {
            return desObj;
        }
    }

    checkDir(hotel : hotellist): Observable<hotellist> {
        let folderPath: string = 'TravellersPass/Image/Hotel';

        return this.fileService.checkDir(folderPath, hotel.HotelCode)
            .pipe(
                map(
                    (dirExist: boolean) => {
                        return hotel;
                    }
                ),
                catchError(
                    (error: FileError) => {
                        return this.fileService.createDir(folderPath, hotel.HotelCode)
                            .pipe(
                                map(
                                    (dir: DirectoryEntry) => {
                                        return hotel;
                                    }
                                )
                            )

                    }
                )
            )
    }

    getImages(hotel: hotellist): Observable<hotellist> {
        return from(hotel.Images)
            .pipe(
                skipWhile(el => _.isNull(el) || el.length == 0),
                mergeMap(
                    (img: string) => {

                        let url: string = img;
                        let splitedEl: string[] = img.split('/');

                        let folderName: string = hotel.HotelCode;
                        let folderPath: string = 'TravellersPass/Image/Hotel';

                        let fileName: string = splitedEl[splitedEl.length - 1];
                        let filePath: string = folderPath + '/' + folderName + '/' + fileName + '.jpg';

                        return this.fileService.checkFile(filePath, fileName)
                            .pipe(
                                map(
                                    (fileExist) => {
                                        return this.file.externalRootDirectory + filePath;
                                    }
                                ),
                                catchError(
                                    (error: FileError) => {
                                        return this.fileService.downloadFile(url, filePath)
                                            .pipe(
                                                map(
                                                    (files: FileEntry) => {
                                                        let str: string = files.fullPath;
                                                        return this.file.externalRootDirectory + str;
                                                    }
                                                ),
                                                catchError(
                                                    (err: FileTransferError) => {
                                                        return of('');
                                                    }
                                                )
                                            )
                                    }
                                )
                            )
                    }
                ),
                skipWhile(el => el == ''),
                toArray(),
                map(
                    (el) => {
                        hotel.Images = el;
                        return hotel;
                    }
                )
            )
    }
}