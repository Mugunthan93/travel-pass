import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { sortButton } from './flight.state';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { File } from '@ionic-native/file/ngx';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { LoadingController } from '@ionic/angular';
import { Observable, of, from, iif } from 'rxjs';
import { mergeMap, take, toArray, switchMap, tap, catchError, map, mapTo, retry, retryWhen, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

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
    constructor(public list: hotelresponselist[]) {

    }
}

export class DownloadImage {
    static readonly type = "[hotel_result] DownloadImage";
    constructor(public img : string, public code : string) {

    }
}

export class hotelImageResponse {
    static readonly type = "[hotel_result] hotelImageResponse";
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
        private hotelService: HotelService,
        private file: File,
        private transfer: FileTransfer,
        public loadingCtrl : LoadingController
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

        states.dispatch(new DownloadResult(action.response.HotelResults));

    }

    // @Action(hotelImageResponse)
    // async getImageResponse(states: StateContext<hotelresult>) {

    //     let currentList = states.getState().hotelList;
    //     try {
    //         let getImageList = await this.getImages(currentList);
    //         console.log(getImageList);
    //         states.patchState({
    //             hotelList: getImageList
    //         });
    //     }
    //     catch (error) {
    //         console.log(error);
    //         states.patchState({
    //             hotelList: currentList
    //         });
    //     }

    // }

    @Action(DownloadResult)
    downloadresult(states: StateContext<hotelresult>, action: DownloadResult) {
        return from(action.list)
            .pipe(
                take(states.getState().listLimit),
                mergeMap(
                    async (el: hotelresponselist) => {
                        console.log(el);

                        if (el.SupplierHotelCodes) {

                            let traceId: string = states.getState().traceId;
                            let currentList: hotellist[] = states.getState().hotelList;

                            let hotelInfo = {
                                CategoryId: el.SupplierHotelCodes[0].CategoryId,
                                EndUserIp: "192.168.0.115",
                                HotelCode: el.HotelCode,
                                ResultIndex: el.ResultIndex,
                                TraceId: traceId
                            }

                            let hotelinfoResponse = await this.hotelService.getHotelInfo(hotelInfo);
                            let hotelData: hotelinfoList = JSON.parse(hotelinfoResponse.data).response.HotelDetails;
                            console.log(JSON.parse(hotelinfoResponse.data).response);

                            if (JSON.parse(hotelinfoResponse.data).response.Error.ErrorCode == 2) {
                                return;
                            }

                            let hotel: any = _.merge(hotelData, el);
                            let pickedHotel: hotellist = _.pick(hotel, [
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

                            currentList.push(pickedHotel);

                            states.patchState({
                                hotelList: currentList
                            });
                        }

                    }
                )
            )
    }
    
    @Action(DownloadImage)
    downloadPicture(states: StateContext<hotelresult>, action: DownloadImage): Observable<string> {

        return from(action.img)
            .pipe(
                tap(
                    async (img: string) => {
                        const fileTransfer: FileTransferObject = this.transfer.create();
                
                        let splitedEl: string[] = img.split('/');
                        let fileName: string = splitedEl[splitedEl.length - 1];
                        let folderName: string = action.code;
                
                        let url: string = img;
                        let path: string = this.file.externalRootDirectory + 'TravellersPass/Hotel/Images/' + folderName + '/' + fileName + '.jpg';
                
                        try {
                            if (await this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass/Hotel/Images/', folderName)) {
                                return path;
                            }
                        }
                        catch (error) {
                            if (error.code == 1) {
                                try {
                                    const fileResponse = await fileTransfer.download(url, path);
                                    console.log(fileResponse);
                                    if (fileResponse.isFile) {
                                        let str: string = fileResponse.fullPath;
                                        console.log(str);
                                        return str;
                                    }
                                }
                                catch (error) {
                                    console.log(error);
                                    return null;
                                }
                            }
                        }
                    }
                )
            )

    }
    
}