import { State, Selector, Action, StateContext, Store } from "@ngxs/store";
import { services, fareObj, FLightBookState } from '../book/flight.state';
import * as _ from 'lodash';
import { OneWaySearchState } from '../search/flight/oneway.state';
import { RoundTripSearchState } from '../search/flight/round-trip.state';
import { MultiCitySearchState } from '../search/flight/multi-city.state';
import { UserState } from '../user.state';
import { CompanyState } from '../company.state';
import { ModalController } from '@ionic/angular';
import { SearchState } from '../search.state';


export interface flightpassengerstate {
    passengerList: flightpassenger[]
    passengerCount: number;
    selected: flightpassenger[]
}

export interface flightpassenger extends addPassenger {
    AddressLine1: string,
    City: string,
    CountryName: string,
    CountryCode: string,
    Email: string,
    onwardExtraServices: services,
    returnExtraServices: services,
    PaxType: number,
    IsLeadPax: boolean,
    Gender: number,
    GSTCompanyEmail: string,
    GSTCompanyAddress: string,
    GSTCompanyContactNumber: string,
    GSTCompanyName: string,
    GSTNumber: string,
    Fare: fareObj
}

export interface addPassenger {
    Title: string,
    FirstName: string,
    LastName: string,
    DateOfBirth: string,
    ContactNo: string,
    PassportNo: string,
    PassportExpiry: string,

    nationality?: string,
    ftnumber?: string
}

/////////////////////////////////////////////////////////////////////

export class SetFirstPassengers {
    static readonly type = "[flight_book] SetFirstPassengers";
}

export class AddPassenger {
    static readonly type = "[flight_book] AddPassenger";
    constructor(public pass: flightpassenger) {

    }
}

export class EditPassenger {
    static readonly type = "[flight_book] EditPassenger";
    constructor(public pass: flightpassenger, public pax: flightpassenger) {

    }
}

export class DeletePassenger {
    static readonly type = "[flight_book] DeletePassenger";
    constructor(public pax: flightpassenger) {

    }
}

export class SelectPassenger {
    static readonly type = "[flight_book] SelectPassenger";
    constructor(public pass: flightpassenger) {

    }
}

export class DeselectPassenger {
    static readonly type = "[flight_book] DeselectPassenger";
    constructor(public pass: flightpassenger) {

    }
}

@State<flightpassengerstate>({
    name: 'flight_passenger',
    defaults: {
        passengerList: [],
        selected: [],
        passengerCount : 0
    }
})
export class FlightPassengerState {

    constructor(
        public modalCtrl: ModalController,
        private store : Store
    ) {
        
    }

    @Selector()
    static getPassengers(states: flightpassengerstate): flightpassenger[] {
        return states.passengerList
    }

    @Selector()
    static getLeadPassenger(states: flightpassengerstate): flightpassenger {
        return states.passengerList[0]
    }

    @Selector()
    static getSelectedPassengers(states: flightpassengerstate): flightpassenger[] {
        return states.selected;
    }

    @Selector()
    static getSelected(states: flightpassengerstate): number {
        return states.selected.length;
    }

    @Selector()
    static getCount(states: flightpassengerstate): number {
        return states.passengerCount;
    }

    @Action(AddPassenger)
    addPassenger(states: StateContext<flightpassengerstate>, action: AddPassenger) {

        let currentPass : flightpassenger[] = Object.assign([], states.getState().passengerList);
        currentPass.push(action.pass);

        states.patchState({
            passengerList: currentPass
        });

        this.modalCtrl.dismiss(null, null, 'passenger-details');
    }

    @Action(EditPassenger)
    editPassenger(states: StateContext<flightpassengerstate>, action: EditPassenger) {

        let passengers: flightpassenger[] = Object.assign([], states.getState().passengerList);
        let filterPass: flightpassenger[] = _.remove(passengers, (o) => {
            return o.PassportNo !== action.pax.PassportNo
        });
        filterPass.push(action.pass);

        states.patchState({
            passengerList: filterPass
        });

        this.modalCtrl.dismiss(null, null, 'passenger-details');
    }

    @Action(DeletePassenger)
    deletePassenger(states: StateContext<flightpassengerstate>, action: DeletePassenger) {

        let passengers: flightpassenger[] = Object.assign([], states.getState().passengerList);
        let filterPass: flightpassenger[] = _.remove(passengers, (o) => {
            return o.PassportNo !== action.pax.PassportNo
        });

        states.patchState({
            passengerList: filterPass
        });
    }

    @Action(SetFirstPassengers)
    setFirstPassengers(states: StateContext<flightpassengerstate>) {

        let passengerCount: number = 0;

        switch (this.store.selectSnapshot(SearchState.getSearchType)) {
            case 'one-way': passengerCount = this.store.selectSnapshot(OneWaySearchState.getAdult); break;
            case 'round-trip': passengerCount = this.store.selectSnapshot(RoundTripSearchState.getAdult); break;
            case 'multi-city': passengerCount = this.store.selectSnapshot(MultiCitySearchState.getAdult); break;
        }

        let passengers: flightpassenger[] = [];

        passengers[0] = {
            AddressLine1: this.store.selectSnapshot(UserState.getAddress),
            City: this.store.selectSnapshot(UserState.getCity),
            CountryName: this.store.selectSnapshot(UserState.getCountryName),
            CountryCode: null,
            Email: this.store.selectSnapshot(UserState.getEmail),
            onwardExtraServices: {
                Meal: [],
                MealTotal: 0,
                BagTotal: 0,
                Baggage: []
            },
            returnExtraServices: {
                Meal: [],
                MealTotal: 0,
                BagTotal: 0,
                Baggage: []
            },
            PaxType: 1,
            IsLeadPax: true,
            FirstName: this.store.selectSnapshot(UserState.getFirstName),
            LastName: this.store.selectSnapshot(UserState.getLastName) == null ? '' : this.store.selectSnapshot(UserState.getLastName),
            ContactNo: this.store.selectSnapshot(UserState.getContact),
            DateOfBirth: this.store.selectSnapshot(UserState.getDOB),
            PassportNo: this.store.selectSnapshot(UserState.getPassportNo),
            PassportExpiry: this.store.selectSnapshot(UserState.getPassportExpiry),
            Title: this.store.selectSnapshot(UserState.getTitle) == 'Female' ? 'Ms' : 'Mr',
            Gender: this.store.selectSnapshot(UserState.getTitle) == 'Female' ? 2 : 1,
            GSTCompanyEmail: this.store.selectSnapshot(CompanyState.gstCompanyEmail),
            GSTCompanyAddress: this.store.selectSnapshot(CompanyState.gstCompanyAddress),
            GSTCompanyContactNumber: this.store.selectSnapshot(CompanyState.getContact),
            GSTCompanyName: this.store.selectSnapshot(CompanyState.getCompanyName),
            GSTNumber: this.store.selectSnapshot(CompanyState.gstNumber),
            Fare: this.store.selectSnapshot(FLightBookState.getFare)
        }

        states.patchState({
            passengerList: passengers,
            passengerCount: passengerCount
        });

    }

    @Action(SelectPassenger)
    selectPassenger(states: StateContext<flightpassengerstate>, action: SelectPassenger) {
        let passArray: flightpassenger[] = Object.assign([], states.getState().selected);
        passArray.push(action.pass);
        states.patchState({
            selected: passArray
        });
    }

    @Action(DeselectPassenger)
    deselectPassenger(states: StateContext<flightpassengerstate>, action: DeselectPassenger) {
        let passArray = Object.assign([], states.getState().selected);
        const currentArray = passArray.filter(el => el !== action.pass);
        states.patchState({
            selected: currentArray
        });
    }

}