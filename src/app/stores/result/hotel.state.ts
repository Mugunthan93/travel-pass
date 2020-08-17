import { State, Action, StateContext, Selector } from '@ngxs/store';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { File, FileError, FileEntry, DirectoryEntry } from '@ionic-native/file/ngx';
import { FileTransferObject, FileTransfer, FileTransferError } from '@ionic-native/file-transfer/ngx';
import { LoadingController } from '@ionic/angular';
import { Observable, from, throwError, of } from 'rxjs';
import { mergeMap, take, toArray, tap, catchError, skipWhile, takeWhile, flatMap, map, switchMap, exhaustMap, retryWhen, delayWhen, finalize, concatMap } from 'rxjs/operators';
import { SearchHotel } from '../search/hotel.state';
import { SharedService } from 'src/app/services/shared/shared.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { sortButton } from './sort.state';
import * as _ from 'lodash';
import { FileService } from 'src/app/services/file/file.service';
import { isNull } from 'lodash';
import { ResultMode } from '../result.state';
import { Navigate } from '@ngxs/router-plugin';

export interface hotelresult {
    hotelresponseList: hotelresponselist[]
    hotelList: hotellist[]
    traceId: string
    selectedHotel: selectedHotel
    selectedHotelImages: string[]
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
    CancellationPolicies?: cancellationPolicy[]
    CancellationPolicy?: string
    CategoryId?: string
    ChildCount?: number
    DayRates?: dayRates[]
    HotelSupplements?: any[]
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
    SmokingPreference?: string
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

export class GetToken {
    static readonly type = '[hotel_result] GetToken';
}

@State<hotelresult>({
    name: 'hotel_result',
    defaults: {
        hotelresponseList: [],
        hotelList :[],
        traceId: null,
        selectedHotel: null,
        selectedHotelImages: [],
        listlimit : 10,
        token : null
    }
})

export class HotelResultState{

    constructor(
        private file : File,
        private hotelService: HotelService,
        private fileService : FileService,
        public loadingCtrl: LoadingController,
        private sharedService : SharedService
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
    static getFacilities(states: hotelresult) : number {
        return states.selectedHotel.HotelDetail.HotelFacilities.length;
    }

    @Action(GetToken)
    getToken(states: StateContext<hotelresult>) {

        return from(this.sharedService.getToken())
            .pipe(
                map(
                    (response: HTTPResponse) => {
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
    downloadresult(states: StateContext<hotelresult>, action: DownloadResult) : Observable<any> {

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
                        else {
                            return from(el.SupplierHotelCodes)
                                .pipe(
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
                                                    map(
                                                        (supplyResponse: HTTPResponse) => {
    
                                                            console.log(supplyResponse);
    
                                                            let hotelData: hotelinfoList = JSON.parse(supplyResponse.data).response.HotelDetails;
                                                            let omitedVal = _.omitBy(hotelData, (val) => {
                                                                return _.isNull(val) || (_.isString(val) && val.length < 1) ||
                                                                    (_.isString(val) && val == "https://images.cdnpath.com/Images/HotelNA.jpg") ||
                                                                    (_.isArray(val) && val.length < 1);
                                                            });
    
                                                            //Trace Expired
                                                            if (JSON.parse(supplyResponse.data).response.Error.ErrorCode == 6) {
                                                                states.dispatch(new SearchHotel());
                                                            }
    
                                                            //Search Timeout, Try Again
                                                            if (JSON.parse(supplyResponse.data).response.Error.ErrorCode == -4) {
                                                                console.log(JSON.parse(supplyResponse.data).response);
                                                                return el;
                                                            }
                    
                                                            //No rooms Available from UAPI
                                                            else if (JSON.parse(supplyResponse.data).response.Error.ErrorCode == 2) {
                                                                console.log(JSON.parse(supplyResponse.data).response);
                                                                return el;
                                                            }
    
                                                            //maintainance - 503
                                                            //forbidden - 403
    
                                                            let mergeObj: hotellist = _.merge(omitedVal, el);
                                                            return mergeObj;
                                                        }
                                                    ),
                                                    map(
                                                        (hotel: hotellist) => {
                                                            let folderPath: string = 'TravellersPass/Image/Hotel';
    
                                                            return this.fileService.checkDir(folderPath, hotel.HotelCode)
                                                                .pipe(
                                                                    map(
                                                                        (dirExist: boolean | FileError) => {
                                                                            return hotel;
                                                                        }
                                                                    ),
                                                                    catchError(
                                                                        (error: FileError) => {
                                                                            console.log("checkdir error", error);
                                                                            return this.fileService.createDir(folderPath, hotel.HotelCode)
                                                                                .pipe(
                                                                                    map(
                                                                                        (dir: DirectoryEntry) => {
                                                                                            console.log(dir);
                                                                                            return hotel;
                                                                                        }
                                                                                    )
                                                                                )
    
                                                                        }
                                                                    )
                                                                )
                                                        }
                                                    ),
                                                    flatMap(
                                                        (hotel) => {
                                                            return hotel;
                                                        }
                                                    )
                                                )
                                        }
                                    ),
                                    toArray(),
                                    map(
                                        (hotels: hotellist[]) => {
                                            let current: hotellist = _.assign.apply(_, hotels);
                                            return current;
                                        }
                                    )
                                );
                        }

                    }
                ),
                toArray(),
                map(
                    (hotel : hotellist[]) => {
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
                skipWhile(hotel => hotel.ResultIndex == states.getState().selectedHotel.HotelDetail.ResultIndex),
                map(
                    (hotel: hotellist) => {
                        states.dispatch(new GetToken());
                        const token: string = states.getState().token;
                        let indexes: number[] = [];

                        hotel.SupplierHotelCodes.forEach(
                            (code) => {
                                indexes.push(code.CategoryIndex);
                            }
                        );

                        const viewPayload: viewPayload = {
                            CategoryIndexes: indexes,
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
                map(
                    (response: selectedHotel) => {

                        states.patchState({
                            selectedHotel: response
                        });
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

    getImages(hotel : hotellist) : Observable<hotellist> {
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
                        let filePath: string = folderPath + folderName + '/' + fileName + '.jpg';

                        return this.fileService.checkFile(filePath, fileName)
                            .pipe(
                                map(
                                    (fileExist) => {
                                        console.log("file exist",fileExist);
                                        return this.file.externalRootDirectory + filePath;
                                    }
                                ),
                                catchError(
                                    (error: FileError) => {
                                        console.log("checkfile error", error);
                                        return this.fileService.downloadFile(url, filePath)
                                            .pipe(
                                                map(
                                                    (files: FileEntry) => {
                                                        let str: string = files.fullPath;
                                                        console.log("downloaded str",str);
                                                        return this.file.externalRootDirectory + str;
                                                    }
                                                ),
                                                catchError(
                                                    (err: FileTransferError) => {
                                                        console.log("file transfer error",err);
                                                        return err.source;
                                                    }
                                                )
                                            )
                                    }
                                ),
                            )
                    }
                ),
                toArray(),
                map(
                    (el: string[]) => {
                        console.log("final array",el);
                        hotel.Images = el;
                        return hotel;
                    }
                )
            )
    }
}