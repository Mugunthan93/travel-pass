import { State, Action, StateContext, Selector, Store, ofActionSuccessful } from '@ngxs/store';
import { sortButton } from './flight.state';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { File } from '@ionic-native/file/ngx';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { LoadingController, IonInfiniteScroll } from '@ionic/angular';
import { Observable, of, from, iif, throwError } from 'rxjs';
import { mergeMap, take, toArray, switchMap, tap, catchError, map, mapTo, retry, retryWhen, takeUntil, filter, skipWhile, concatMap, takeWhile, skip } from 'rxjs/operators';
import * as _ from 'lodash';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HotelSearchState, SearchHotel } from '../search/hotel.state';
import { promise } from 'protractor';

export interface hotelresult {
    sort : sortButton[]
    hotelresponseList: hotelresponselist[]
    hotelList: hotellist[]
    traceId: string
    currentSort: sortButton,
    listLimit : number
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
    
    HotelCode: string
    HotelName: string
    HotelPicture: string
    IsTBOMapped: boolean
    Price: hotelprice
    ResultIndex: number
    StarRating: number
    SupplierHotelCodes: supplierhotelcodes[]
    Address: string
    Attractions: attractions[]
    CountryName: string
    Description: string
    HotelFacilities: string[]
    Images: string[]
    PinCode: string
    // HotelAddress: string

    // HotelDescription: string

    // HotelCategory: string
    // HotelContactNo: string
    // HotelLocation: string
    // HotelMap: string
    // HotelPolicy: string
    // HotelPromotion: string
    // Latitude: string
    // Longitude: string
    // RoomDetails: any[]
    // SupplierPrice: any

    // Email: string
    // FaxNumber: string
    // HotelURL: string
    // RoomData: any
    // RoomFacilities: any
    // Services: any
    // SpecialInstructions: any
}

//////////////////////////////////////////////////////////////////////////

export class HotelResponse {
    static readonly type = "[hotel_result] HotelResponse";
    constructor(public response: hotelresponse) {

    }
}

export class DownloadResult {
    static readonly type = "[hotel_result] DownloadResult";
    constructor(public limit: number) {

    }
}

export class DownloadImage {
    static readonly type = "[hotel_result] DownloadImage";
    constructor(public img : string[], public code : string) {

    }
}

export class hotelImageResponse {
    static readonly type = "[hotel_result] hotelImageResponse";
}

export class AddHotelList {
    static readonly type = "[hotel_result] AddHotelList";
    constructor(public event : any) {

    }
}

@State<hotelresult>({
    name: 'hotel_result',
    defaults: {
        sort: [
            { label: 'price', state: 'default', property: 'price' },
            { label: 'star', state: 'default', property: 'stars' },
            { label: 'hotel', state: 'default', property: 'stars' },
        ],
        hotelresponseList: [],
        hotelList :[],
        traceId: null,
        currentSort: { label: 'price', state: 'rotated', property: 'price' },
        listLimit : 10
    }
})

export class HotelResultState{

    constructor(
        private store: Store,
        private webview: WebView,
        private hotelService: HotelService,
        private file: File,
        private transfer: FileTransfer,
        public loadingCtrl: LoadingController
    ) {

    }

    @Selector()
    static getHotelList(state: hotelresult): hotellist[] {
        return state.hotelList;
    }

    @Selector()
    static getButtons(states: hotelresult): sortButton[] {
        return states.sort;
    }

    @Selector()
    static getSortBy(states: hotelresult): sortButton {
        return states.currentSort;
    }

    @Selector()
    static getLimit(states: hotelresult): number {
        return states.listLimit;
    }

    @Action(HotelResponse)
    async getHotelResponse(states: StateContext<hotelresult>, action: HotelResponse) {

        states.patchState({
            hotelresponseList: action.response.HotelResults,
            traceId: action.response.TraceId
        });

        let limit: number = states.getState().listLimit;

        states.dispatch(new DownloadResult(limit));

    }

    @Action(DownloadResult)
    downloadresult(states: StateContext<hotelresult>, action: DownloadResult) {

        let list: hotelresponselist[] = states.getState().hotelresponseList;

        return from(list)
            .pipe(
                take(action.limit),
                skipWhile((el) => {
                    let currentState: hotellist[] = states.getState().hotelList;
                    return currentState.some(hotel => hotel.ResultIndex == el.ResultIndex);
                }),
                mergeMap(
                    async (el: hotelresponselist) => {
                        console.log(el);
                        if (!_.isUndefined(el.SupplierHotelCodes)) {

                            let traceId: string = states.getState().traceId;
                            let pickedHotel: hotellist = null;

                            let hotelInfo = {
                                CategoryId: el.SupplierHotelCodes[0].CategoryId,
                                EndUserIp: "192.168.0.115",
                                HotelCode: el.HotelCode,
                                ResultIndex: el.ResultIndex,
                                TraceId: traceId
                            }

                            let hotelinfoResponse = await this.hotelService.getHotelInfo(hotelInfo);
                            let hotelData: hotelinfoList = JSON.parse(hotelinfoResponse.data).response.HotelDetails;

                            //trace expired
                            if (JSON.parse(hotelinfoResponse.data).response.Error.ErrorCode == 6) {
                                states.dispatch(new SearchHotel());
                                return;
                            }

                            //No rooms Available from UAPI
                            else if (JSON.parse(hotelinfoResponse.data).response.Error.ErrorCode == 2) {
                                pickedHotel = null;
                            }

                            else {
                                let hotel: any = _.mergeWith(hotelData, el, this.customizedObj);
                                pickedHotel = _.pick(hotel, [
                                    'HotelCode',
                                    'HotelName',
                                    'HotelPicture',
                                    'IsTBOMapped',
                                    'Price',
                                    'ResultIndex',
                                    'StarRating',
                                    'SupplierHotelCodes',
                                    'Address',
                                    'Attractions',
                                    'CountryName',
                                    'Description',
                                    'HotelFacilities',
                                    'Images',
                                    'PinCode',
                                    'pictures'
                                ]);
                            }

                            return pickedHotel;
                        }
                    }
                ),
                catchError(
                    (err) => {
                        console.log(err);
                        return undefined;
                    }
                ),
                skipWhile((el) => {
                    return _.isUndefined(el) || _.isNull(el);
                }),
                toArray(),
                tap(
                    (val: hotellist[]) => {
                        states.patchState({
                            hotelList : val
                        });
                    }
                )
            )
    }
    
    @Action(DownloadImage)
    downloadPicture(states: StateContext<hotelresult>, action: DownloadImage): Observable<string> {

        return from(action.img)
            .pipe(
                mergeMap(
                    (img: string) => {
                        const fileTransfer: FileTransferObject = this.transfer.create();
                
                        let splitedEl: string[] = img.split('/');
                        let fileName: string = splitedEl[splitedEl.length - 1];
                        let folderName: string = action.code;
                
                        let url: string = img;
                        let path: string = this.file.externalRootDirectory + 'TravellersPass/Hotel/Images/' + folderName + '/' + fileName + '.jpg';
                
                        if (from(this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass/Hotel/Images/', folderName))) {
                            return path;
                        }
                        else {
                            return from(fileTransfer.download(url, path))
                                .pipe(
                                    tap(
                                        (file) => {
                                            if (file.isFile) {
                                                let str: string = file.fullPath;
                                                console.log(str);
                                                return str;
                                            }
                                        }
                                    )
                                );
                        }
                    }
                ),
                catchError(
                    (err) => {
                        console.log(err);
                        return err;
                    }
                ),
                tap(el => of(this.webview.convertFileSrc(el)))
            )

    }

    @Action(AddHotelList)
    async addHotelList(states: StateContext<hotelresult>, action: AddHotelList) {
        let currentState: number = states.getState().listLimit;
        currentState += 10;
        states.patchState({
            listLimit: currentState
        });
        states.dispatch(new DownloadResult(currentState));
        await action.event.target.complete();

    }

    customizedObj(desObj: hotelinfoList, srcObj : hotelresponselist) {
        if (_.isUndefined(desObj)) {
            return srcObj;
        }
        else if (_.isUndefined(srcObj)) {
            return desObj;
        }
    }
    
}