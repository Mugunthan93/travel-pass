import { State, Action, StateContext, Selector, Store  } from '@ngxs/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { city, nationality, hotelcity } from '../shared.state';
import { Navigate } from '@ngxs/router-plugin';
import { HotelService } from 'src/app/services/hotel/hotel.service';
import { hotelResponse, HotelResponse } from '../result/hotel.state';
import { ResultMode } from '../result.state';

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

export class HotelForm{
    static readonly type = "[hotel_search] HotelForm";
    constructor(public hotelForm: hotelForm) {

    }
}

export class SearchHotel {
    static readonly type = "[hotel_search] SearchHotel";
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
        }]
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

    @Action(AddRoom)
    addRoom(states: StateContext<hotelsearch>, action: AddRoom) {

        let currentRooms : roomguest[] = Object.assign([],states.getState().rooms);
        let room: roomguest = {
            ChildAge: [],
            NoOfAdults: 0,
            NoOfChild: 0
        }
        currentRooms.push(room);

        states.patchState({
            rooms: currentRooms
        });
    }

    @Action(DeleteRoom)
    deleteRoom(states: StateContext<hotelsearch>, action: DeleteRoom) {
        
        let currentRooms: roomguest[] = Object.assign([], states.getState().rooms);
        let filteredRooms = currentRooms.filter(
            (el: roomguest, ind: number, arr: roomguest[]) => {
                return !(ind == action.roomId)
            }
        );
        console.log(filteredRooms);
        states.patchState({
            rooms: filteredRooms
        });
    }

    @Action(AddAdult)
    addAdult(states: StateContext<hotelsearch>, action: AddAdult) {
        let currentRooms: roomguest[] = states.getState().rooms;
        let filteredRooms: roomguest[] = currentRooms.map(
            (el: roomguest, ind: number, arr: roomguest[]) => {
                let newEl = Object.assign({}, el);
                if (ind == action.roomId) {
                    newEl.NoOfAdults += 1;
                }
                return newEl;
            }
        );
        states.patchState({
            rooms: filteredRooms
        });
    }

    @Action(RemoveAdult)
    removeAdult(states: StateContext<hotelsearch>, action: AddAdult) {
        let currentRooms: roomguest[] = states.getState().rooms;
        let filteredRooms: roomguest[] = currentRooms.map(
            (el: roomguest, ind: number, arr: roomguest[]) => {
                let newEl = Object.assign({}, el);
                if (ind == action.roomId) {
                    if (newEl.NoOfAdults >= 1) {
                        newEl.NoOfAdults -= 1;
                    }
                }
                return newEl;
            }
        );
        states.patchState({
            rooms: filteredRooms
        });
    }

    @Action(AddChild)
    addChild(states: StateContext<hotelsearch>, action: AddChild) {
        let currentRooms: roomguest[] = states.getState().rooms;
        let filteredRooms: roomguest[] = currentRooms.map(
            (el: roomguest, ind: number, arr: roomguest[]) => {
                let newEl = Object.assign({}, el);
                if (ind == action.roomId) {
                    newEl.NoOfChild += 1;
                    newEl.ChildAge = Object.assign([], el.ChildAge);
                    newEl.ChildAge.push(null);
                }
                return newEl;
            }
        );
        states.patchState({
            rooms: filteredRooms
        });
    }

    @Action(RemoveChild)
    removeChild(states: StateContext<hotelsearch>, action: RemoveChild) {
        let currentRooms: roomguest[] = states.getState().rooms;
        let filteredRooms: roomguest[] = currentRooms.map(
            (el: roomguest, ind: number, arr: roomguest[]) => {
                let newEl = Object.assign({}, el);
                if (ind == action.roomId) {
                    if (newEl.NoOfChild >= 1) {
                        newEl.NoOfChild -= 1;
                        newEl.ChildAge = Object.assign([], el.ChildAge);
                        newEl.ChildAge.pop();
                    }
                }
                return newEl;
            }
        );
        states.patchState({
            rooms: filteredRooms
        });
    }

    @Action(SetAge)
    setAge(states: StateContext<hotelsearch>, action: SetAge) {
        let currentRooms: roomguest[] = states.getState().rooms;
        let filteredRooms: roomguest[] = currentRooms.map(
            (el: roomguest, ind: number, arr: roomguest[]) => {
                let newEl = Object.assign({}, el);
                if (ind == action.roomIndex) {
                    newEl.ChildAge = Object.assign([], el.ChildAge);
                    newEl.ChildAge[action.ageIndex] = action.value;
                }
                return newEl;
            }
        );
        states.patchState({
            rooms: filteredRooms
        });
    }

    @Action(DismissRoom)
    async dismissRoom(states: StateContext<hotelsearch>) {

        let failedAlert = await this.alertCtrl.create({
            header : 'Check Room Details',
            buttons: [{
                text: 'ok',
                handler: async () => {
                    return await this.alertCtrl.dismiss();
                }
            }]
        });

        if (states.getState().rooms.length >= 0 && states.getState().rooms.some((el) => el.NoOfAdults > 0)) {
            this.modalCtrl.dismiss(states.getState().rooms);
        }
        else if (states.getState().rooms.length <= 0 ) {
            failedAlert.message = 'Add Atlease One Room';
            failedAlert.present();
        }
        else if (states.getState().rooms.some((el) => el.NoOfAdults <= 0)) {
            failedAlert.message = 'Add Atlease One Adult in all the Room';
            failedAlert.present();
        }
        else if (states.getState().rooms.some((el) => el.NoOfChild > 0)) {
            if( states.getState().rooms.some( (el) => (el.NoOfChild != el.ChildAge.length || !el.ChildAge.some(el => el !== null) ) ) ) {
                failedAlert.message = 'Check Age of all Childrens in all the Rooms';
                failedAlert.present();
            }    
        }


    }

    @Action(HotelForm)
    HotelForm(states: StateContext<hotelsearch>, action: HotelForm) {
        states.patchState({
            formData : action.hotelForm
        });
    }

    @Action(SearchHotel)
    async searchHotel(states: StateContext<hotelsearch>) {

        const loading = await this.loadingCtrl.create({
            spinner: "crescent",
            id: 'search-hotel'
        });
        const failedAlert = await this.alertCtrl.create({
            header: 'Search Failed',
            buttons: [{
                text: 'Ok',
                role: 'ok',
                cssClass: 'danger',
                handler: (res) => {
                    failedAlert.dismiss({
                        data: false,
                        role: 'failed'
                    });
                }
            }]
        });

        loading.message = "Searching Hotel...";
        await loading.present();

        let currentForm: hotelForm = states.getState().formData;

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

        states.patchState({
            payload: payload
        });

        try {
            let hotelResponse = await this.hotelService.searchHotel(payload);
            let hoteldata: hotelResponse = JSON.parse(hotelResponse.data);
            states.dispatch(new HotelResponse(hoteldata.response));
            states.dispatch(new ResultMode('hotel'));
            this.loadingCtrl.dismiss(null, null, 'search-hotel');
            states.dispatch(new Navigate(['/', 'home', 'result', 'hotel']));
        }
        catch (error) {
            console.log(error);
            if (error.status == -4) {
                failedAlert.message = "Search Timeout, Try Again";
            }
            //no result error
            if (error.status == 400) {
                const errorString = JSON.parse(error.error);
                failedAlert.message = errorString.message.response.Error.ErrorMessage;
            }
            //502 => proxy error
            if (error.status == 502) {
                failedAlert.message = "Server failed to get correct information";
            }
            //503 => service unavailable, Maintanence downtime
            if (error.status == 503) {
                failedAlert.message = "Server Maintanence Try again Later";
            }
            loading.dismiss();
            failedAlert.present();
        }

    }
}