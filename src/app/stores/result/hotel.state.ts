import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { sortButton } from './flight.state';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import * as _ from 'lodash';

export interface hotelresult {
    sort : sortButton[]
    hotelList: hotellist[]
    traceId: string
    currentSort : sortButton
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
    StarRating: string[]
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

export class hotelInfoResponse {
    static readonly type = "[hotel_result] hotelInfoResponse";
    constructor(public hotelinfo: hotelinfoList, public hotelresponse: hotelresponselist) {

    }
}

@State<hotelresult>({
    name: 'hotel_result',
    defaults: {
        sort: [
            { label: 'price', state: 'default', property: 'price' },
            { label: 'star', state: 'default', property: 'stars' },
        ],
        hotelList : [],
        traceId: null,
        currentSort: { label: 'price', state: 'rotated', property: 'price' }
    }
})

export class HotelResultState{

    constructor(
        private store: Store,
        private hotelService: HotelService
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

    @Action(HotelResponse)
    getHotelResponse(states: StateContext<hotelresult>, action: HotelResponse) {

        action.response.HotelResults.forEach(
            async (el: hotelresponselist, ind: number, arr: hotelresponselist[]) => {

                if (el.SupplierHotelCodes) {

                    let hotelInfo = {
                        CategoryId: el.SupplierHotelCodes[0].CategoryId,
                        EndUserIp: "192.168.0.115",
                        HotelCode: el.HotelCode,
                        ResultIndex: el.ResultIndex,
                        TraceId: action.response.TraceId
                    }

                    try {
                        let hotelinfoResponse = await this.hotelService.getHotelInfo(hotelInfo);
                        let hotelData: hotelinfoList = JSON.parse(hotelinfoResponse.data).response.HotelDetails;
                        this.store.dispatch(new hotelInfoResponse(hotelData,el));
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        );

        states.patchState({
            traceId : action.response.TraceId
        });
    }

    @Action(hotelInfoResponse)
    hotelInfoResponse(states: StateContext<hotelresult>, action: hotelInfoResponse) {

        let info: any = action.hotelinfo;
        let response: any = action.hotelresponse;
        let hotel: any;
        hotel = _.merge(info, response);
        
        let pickedHotel : hotellist = _.pick(hotel,[
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
            'PinCode'
        ]);

        let currentinfoList = Object.assign([], states.getState().hotelList);
        currentinfoList.push(pickedHotel);

        states.patchState({
            hotelList: currentinfoList
        });

    }
    
}