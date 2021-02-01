import { State, Action, StateContext, Selector, Store, Select  } from '@ngxs/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { nationality, hotelcity } from '../shared.state';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { from, forkJoin, of, Observable } from 'rxjs';
import { map, catchError, tap, flatMap, concat } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { hotelprice, supplierhotelcodes, hotelresponse, HotelResponse } from '../result/hotel.state';
import { ResultMode } from '../result.state';
import { Navigate } from '@ngxs/router-plugin';
import { CompanyState } from '../company.state';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';

export interface hotelsearch{
    formData : hotelForm
    payload : hotelsearchpayload
    rooms: roomguest[]
}

export interface hotelForm {
    checkin: Date
    checkout: Date
    city: hotelcity
    nationality: nationality
    room: roomguest[]
    star: number
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

export interface staticpayload {
    CityId: string,
    ClientId: string,
    EndUserIp: string,
    HotelId?: string,
    IsCompactdata?: boolean
}

export interface staticresponselist{
    Address: staticaddress
    Attributes: staticattributes
    HotelName: string
    TBOHotelCode: string
    VendorMessages: vendormessges
}

export interface vendormessges {
    VendorMessage: vendormessage[]
}

export interface vendormessage {
    InfoType: string
    SubSection: subsection[]
    Title: string

}

export interface subsection {
    Paragraph: paragraph
    SubTitle: string
}

export interface paragraph{
    Text: text
    URL: string
}

export interface text {
    $t:string
    ID: string
    TextFormat: string
}

export interface staticaddress{
    AddressLine: string[]
    CityName: string
    CountryName: { Code: string, $t: string }
    PostalCode: string
    StateProv: string
    xmlns: string
}

export interface staticattributes {
    Attribute: staticattribute[]
    xmlns: string
}

export interface staticattribute {
    AttributeName: string
    AttributeType: string
}

export interface hotelresultlist {
    HotelCode: string
    HotelPicture: string
    Price: hotelprice
    ResultIndex: number
    StarRating: number
    SupplierHotelCodes: supplierhotelcodes[]
    Facilities?: string[]
    Images?: string[]
    Description: string
    Place: string
}

////////////////////////////////////////////////////////////////////////////

export class AddRoom {
    static readonly type = "[hotel_search] AddRoom";
}

export class DeleteRoom {
    static readonly type = "[hotel_search] DeleteRoom";
    constructor(public roomId: number) {

    }
}

export class AddAdult {
    static readonly type = "[hotel_search] AddAdult";
    constructor(public roomId: number) {

    }
}

export class RemoveAdult {
    static readonly type = "[hotel_search] RemoveAdult";
    constructor(public roomId: number) {

    }
}

export class AddChild {
    static readonly type = "[hotel_search] AddChild";
    constructor(public roomId: number) {

    }
}

export class RemoveChild {
    static readonly type = "[hotel_search] RemoveChild";
    constructor(public roomId: number) {

    }
}

export class SetAge {
    static readonly type = "[hotel_search] SetAge";
    constructor(public value: number,public ageIndex : number, public roomIndex : number) {

    }
}

export class DismissRoom {
    static readonly type = "[hotel_search] DismissRoom";
}

export class SearchHotel {
    static readonly type = "[hotel_search] SearchHotel";
    constructor(public hotelForm: hotelForm) {

    }
}

@State<hotelsearch>({
    name: 'hotel_search',
    defaults: {
        formData : null,
        payload: null,
        rooms: [{
            ChildAge: [],
            NoOfAdults: 1,
            NoOfChild: 0
        }],
    }
})
export class HotelSearchState {

    constructor(
        private store: Store,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        private hotelService : HotelService
    ) {

    }

    @Selector() 
    static getRooms(state: hotelsearch): roomguest[] {
        return state.rooms;
    }

    @Selector()
    static checkRoom(state: hotelsearch): boolean {
        return state.rooms.length >= 0;
    }

    @Selector()
    static checkAdult(state: hotelsearch): boolean {
        return state.rooms.some((el) => el.NoOfAdults >= 0);
    }

    @Selector()
    static checkChildrenAge(state: hotelsearch): boolean {
        return state.rooms.some((el) => (el.NoOfChild == el.ChildAge.length) && (el.ChildAge.some(el => el !== null)));
    }

    @Selector()
    static getNights(state : hotelsearch): number {
        return moment(state.formData.checkout).diff(moment(state.formData.checkin), 'days');
    }

    @Selector()
    static getSearchData(state: hotelsearch): hotelForm {
        return state.formData;
    }

    @Selector()
    static getNationality(state: hotelsearch): string {
        return state.formData.nationality.country_code;
    }

    @Selector()
    static getGuest(state: hotelsearch): number {
        let guest: number = 0;
        state.formData.room.forEach(
            (el) => {
                guest += el.NoOfAdults + el.NoOfChild;
            }
        );
        return guest;
    }

    @Selector()
    static getTotalAdult(state: hotelsearch): number {
        let guest: number = 0;
        state.formData.room.forEach(
            (el) => {
                guest += el.NoOfAdults;
            }
        );
        return guest;
    }

    @Selector()
    static getTotalChildren(state: hotelsearch): number {
        let guest: number = 0;
        state.formData.room.forEach(
            (el) => {
                guest += el.NoOfChild;
            }
        );
        return guest;
    }

    @Selector()
    static getPayload(state: hotelsearch): hotelsearchpayload {
        return state.payload;
    }

    @Selector()
    static getCityId(state: hotelsearch): string {
        return state.formData.city.cityid.toString();
    }

    @Selector()
    static getTotalRooms(state: hotelsearch) : number {
        return state.rooms.length;
    }

    @Action(AddRoom)
    addRoom(states: StateContext<hotelsearch>) {

        let roomAlert$ = from(this.alertCtrl.create({
            header: 'Room Exceed',
            message: 'Cannot add more than 6 room',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        return true;
                    }
                }
            ]
        })).pipe(
            map(
                (alertEl) => {
                    return from(alertEl.present());
                }
            )
        );

        if (states.getState().rooms.length < 6) {
            states.setState(patch({
                rooms : append([{
                    ChildAge: [],
                    NoOfAdults: 0,
                    NoOfChild: 0
                }])
            }));
        }
        else {
            return roomAlert$;
        }

    }

    @Action(DeleteRoom)
    deleteRoom(states: StateContext<hotelsearch>, action: DeleteRoom) {
        states.setState(patch({
            rooms: removeItem(action.roomId)
        }));
    }

    @Action(AddAdult)
    addAdult(states: StateContext<hotelsearch>, action: AddAdult) {

        let adultAlert$ = from(this.alertCtrl.create({
            header: 'Adult Exceed',
            message: 'Cannot add more than 8 Adult for each room',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        return true;
                    }
                }
            ]
        })).pipe(
            map(
                (alertEl) => {
                    return from(alertEl.present());
                }
            )
        );

        if (states.getState().rooms[action.roomId].NoOfAdults < 8) {

            let adult = states.getState().rooms[action.roomId].NoOfAdults + 1 
            states.setState(patch({
                rooms : updateItem(action.roomId,patch({
                    NoOfAdults : adult
                }))
            }))

        }
        else {
            return adultAlert$;
        }

    }

    @Action(RemoveAdult)
    removeAdult(states: StateContext<hotelsearch>, action: AddAdult) {
        if (states.getState().rooms[action.roomId].NoOfChild >= 1) {
            let adult = states.getState().rooms[action.roomId].NoOfAdults - 1 
            states.setState(patch({
                rooms : updateItem(action.roomId,patch({
                    NoOfAdults : adult
                }))
            }))
        }
    }

    @Action(AddChild)
    addChild(states: StateContext<hotelsearch>, action: AddChild) {

        let childAlert$ = from(this.alertCtrl.create({
            header: 'Adult Exceed',
            message: 'Cannot add more than 2 children for each room',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        return true;
                    }
                }
            ]
        })).pipe(
            map(
                (alertEl) => {
                    return from(alertEl.present());
                }
            )
        );

        if (states.getState().rooms[action.roomId].NoOfChild < 2) {
            let child = states.getState().rooms[action.roomId].NoOfChild + 1 
            states.setState(patch({
                rooms : updateItem(action.roomId,patch({
                    NoOfChild : child,
                    ChildAge : append([null])
                }))
            }))
        }
        else {
            return childAlert$;
        }

    }

    @Action(RemoveChild)
    removeChild(states: StateContext<hotelsearch>, action: RemoveChild) {
        
        if (states.getState().rooms[action.roomId].NoOfChild >= 1) {
            let childage = states.getState().rooms[action.roomId].NoOfChild - 1 
            let age = states.getState().rooms[action.roomId].ChildAge;
            states.setState(patch({
                rooms : updateItem(action.roomId,patch({
                    NoOfChild : childage,
                    ChildAge : removeItem(age.length - 1)
                }))
            }))
        }
    }

    @Action(SetAge)
    setAge(states: StateContext<hotelsearch>, action: SetAge) {
        states.setState(patch({
            rooms : patch({
                [action.roomIndex] : patch({
                    ChildAge : patch({
                        [action.ageIndex] : action.value
                    })
                })
            })
        }));
    }

    @Action(DismissRoom)
    dismissRoom(states: StateContext<hotelsearch>) {

        let failedAlert$ = from(this.alertCtrl.create({
            header : 'Check Room Details',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    return true;
                }
            }]
        }));

        if (states.getState().rooms.length >= 0
            && states.getState().rooms.some((el) => el.NoOfAdults > 0 )
            && states.getState().rooms.some((el) => el.NoOfChild > 0 ? !el.ChildAge.some(el => el == null) : true)
            ) {
            this.modalCtrl.dismiss(states.getState().rooms, null, 'guest-room');
        }
        else {
            return failedAlert$
                .pipe(
                    flatMap(
                        (alertEl) => {
                            if (states.getState().rooms.length <= 0) {
                                alertEl.message = 'Add Atlease One Room';
                                return from(alertEl.present());
                            }
                            else if (states.getState().rooms.some((el) => el.NoOfAdults <= 0)) {
                                alertEl.message = 'Add Atlease One Adult in all the Room';
                                return from(alertEl.present());
                            }
                            else if (states.getState().rooms.some((el) => el.NoOfChild > 0 ? el.ChildAge.some(el => el == null) : true)) {
                                alertEl.message = 'Check Age of all Childrens in all the Rooms';
                                return from(alertEl.present());
                            }
                        }
                    )
                );
        }
    }

    @Action(SearchHotel)
    searchHotel(states: StateContext<hotelsearch>, action: SearchHotel) {

        const loading$ = from(this.loadingCtrl.create({
            spinner: "crescent",
            id: 'search-hotel'
        }));

        let loadingPresent$ = loading$.pipe(
            flatMap(
                (loadingEl) => {
                    loadingEl.message = "Searching Hotel....";
                    return from(loadingEl.present());
                }
            )
        );

        let loadingDismiss$ = loading$.pipe(
            flatMap(
                (loadingEl) => {
                    return from(loadingEl.dismiss());
                }
            )
        );

        const failedAlert$ = from(this.alertCtrl.create({
            header: 'Search Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: () => {
                    return true;
                }
            }]
        }));

        let currentForm: hotelForm = action.hotelForm;
        let payload: hotelsearchpayload = {
            CheckInDate: moment(currentForm.checkin).format('DD/MM/YYYY'),
            CityId: currentForm.city.cityid.toString(),
            CountryCode: currentForm.city.countrycode,
            EndUserIp: "192.168.1.10",
            GuestNationality: currentForm.nationality.country_code,
            IsNearBySearchAllowed: false,
            IsTBOMapped: true,
            MaxRating: 5,
            MinRating: currentForm.star,
            NoOfNights: moment(currentForm.checkout).diff(moment(currentForm.checkin), 'days').toString(),
            NoOfRooms: currentForm.room.length.toString(),
            PreferredCurrency: "INR",
            PreferredHotel: "",
            ResultCount: null,
            ReviewScore: null,
            RoomGuests: currentForm.room
        }
        let staticpay: staticpayload = {
            CityId: currentForm.city.cityid.toString(),
            ClientId: "ApiIntegrationNew",
            EndUserIp: "192.168.0.105",
            IsCompactdata : true
        }
        
        states.patchState({
            formData: action.hotelForm,
            payload: payload
        });

        let hotelResponse$ = this.hotelService.searchHotel(payload)
            .pipe(
                map(
                    (response: HTTPResponse) => {
                        console.log(response);
                        return response;
                    }
                )
            );
        let dumpResponse$ = this.hotelService.getStaticData(staticpay)
            .pipe(
                map(
                    (response: HTTPResponse) => {
                        console.log(response);
                        return response;
                    }
                )
            );

        return loadingPresent$
            .pipe(
                tap(
                    () => {
                        states.dispatch(new ResultMode('hotel'));
                        states.dispatch(new Navigate(['/', 'home', 'result', 'hotel']));
                    }
                ),
                flatMap(
                    () => {
                        return forkJoin([hotelResponse$, dumpResponse$])
                    }
                ),
                flatMap(
                    (response) => {
                        console.log(response);
                        let hotelresult: HTTPResponse = response[0];
                        let dumpresponse: HTTPResponse = response[1];

                        let list1: any[] = JSON.parse(hotelresult.data).response.HotelResults.filter(el => el.IsTBOMapped);
                        let list2: any[] = JSON.parse(dumpresponse.data).ArrayOfBasicPropertyInfo.BasicPropertyInfo;

                        console.log(list1,list2);
                        let list3: hotelresultlist[] = list1.map(el => _.pick(el, ["HotelCode", "Price", "ResultIndex", "StarRating", "SupplierHotelCodes", "Place", "Description","HotelPicture"]));
                        let list4: staticresponselist[] = list2.map(el => _.pick(el, ["Address", "Attributes", "HotelName", "TBOHotelCode","VendorMessages"]));
                        let list5: (staticresponselist & hotelresultlist)[] = list3
                            .map(
                                (dump) => {
                                    if (list4.some(result => result.TBOHotelCode == dump.HotelCode)) {
                                        let result1 = list4.find(result => result.TBOHotelCode == dump.HotelCode);
                                        return _.merge(dump, result1);
                                    }
                                }
                            );
                        let list6: hotelresponse = JSON.parse(hotelresult.data).response;
                        list6.HotelResults = _.compact(list5);

                        states.dispatch(new HotelResponse(list6));
                        return loadingDismiss$
                    }
                ),
                tap(
                    () => {
                        states.dispatch(new ResultMode('hotel'));
                        states.dispatch(new Navigate(['/', 'home', 'result', 'hotel']));
                    }
                ),
                catchError(
                    (error) => {
                        console.log(error);
                        return forkJoin(loadingDismiss$,failedAlert$).pipe(
                            map(
                                (alert) => {
                                    let failedAlert = alert[1];
                                    if (error.status == -4) {
                                        failedAlert.message = "Search Timeout, Try Again";
                                    }
                                    //no result error
                                    if (error.status == 400) {
                                        const errorString = JSON.parse(error.error);
                                        failedAlert.message = 'No Hotels are found,Try some other Date';
                                    }
                                    //502 => proxy error
                                    if (error.status == 502) {
                                        failedAlert.message = "Server failed to get correct information";
                                    }
                                    //503 => service unavailable, Maintanence downtime
                                    if (error.status == 503) {
                                        failedAlert.message = "Server Maintanence Try again Later";
                                    }
                                    return from(failedAlert.present());
                                }
                            )
                        );
                    }
                )
            )

    }
}