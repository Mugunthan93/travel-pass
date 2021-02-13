import { State, Selector, Action, StateContext, Store } from "@ngxs/store";
import { services, fareObj, FLightBookState } from '../book/flight.state';
import * as _ from 'lodash';
import { OneWaySearchState } from '../search/flight/oneway.state';
import { RoundTripSearchState } from '../search/flight/round-trip.state';
import { MultiCitySearchState } from '../search/flight/multi-city.state';
import { UserState } from '../user.state';
import { CompanyState } from '../company.state';
import { ModalController, AlertController } from '@ionic/angular';
import { SearchState } from '../search.state';
import { from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ChooseBaggage } from "../book/flight/oneway.state";
import { append, patch, removeItem, updateItem } from "@ngxs/store/operators";


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
    GSTCompanyEmail?: string,
    GSTCompanyAddress?: string,
    GSTCompanyContactNumber?: string,
    GSTCompanyName?: string,
    GSTNumber?: string,
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

export class DismissFlightPassenger {
    static readonly type = "[flight_book] DismissFlightPassenger";
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
        public alertCtrl: AlertController,
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

        let passenger : any = {};
        if(!action.pass.IsLeadPax) {
            passenger = _.omit(Object.assign({},action.pass),['GSTCompanyEmail','GSTCompanyAddress','GSTCompanyContactNumber','GSTCompanyName','GSTNumber']);
        }
        passenger.Gender = action.pass.Title == 'Ms' ? 2 : 1;

        states.setState(patch({
            passengerList : append([passenger])
        }));

        this.modalCtrl.dismiss(null, null, 'passenger-details');
    }

    @Action(EditPassenger)
    editPassenger(states: StateContext<flightpassengerstate>, action: EditPassenger) {

        let passenger : any = {};
        passenger.Fare = this.store.selectSnapshot(FLightBookState.getFare);
        if(!action.pass.IsLeadPax) {
            passenger = _.omit(Object.assign({},action.pass),['GSTCompanyEmail','GSTCompanyAddress','GSTCompanyContactNumber','GSTCompanyName','GSTNumber']);
        }

        states.setState(patch({
            passengerList : updateItem((el : flightpassenger) => 
            el.FirstName == passenger.FirstName && el.LastName == passenger.LastName && el.Email == passenger.Email,passenger 
            )
        }));

        this.modalCtrl.dismiss(null, null, 'passenger-details');
    }

    @Action(DeletePassenger)
    deletePassenger(states: StateContext<flightpassengerstate>, action: DeletePassenger) {
        states.setState(patch({
            passengerList : removeItem((el : flightpassenger) => el.FirstName == action.pax.FirstName && el.LastName == action.pax.LastName && el.Email == action.pax.Email)
        }));
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
            DateOfBirth: this.store.selectSnapshot(UserState.getDOB) + "T00:00:00.000Z",
            PassportNo: this.store.selectSnapshot(UserState.getPassportNo)  + "T00:00:00.000Z",
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

        states.setState(patch({
            passengerList : append(passengers),
            passengerCount : passengerCount
        }));

        this.modalCtrl.dismiss(null, null, 'passenger-details');

    }

    @Action(SelectPassenger)
    selectPassenger(states: StateContext<flightpassengerstate>, action: SelectPassenger) {
        states.setState(patch({
            selected : append([action.pass])
        }));
    }

    @Action(DeselectPassenger)
    deselectPassenger(states: StateContext<flightpassengerstate>, action: DeselectPassenger) {
        states.setState(patch({
            selected : removeItem((el : flightpassenger) => el.FirstName == action.pass.FirstName && el.LastName == action.pass.LastName && el.Email == action.pass.Email)
        }));
    }

    @Action(DismissFlightPassenger)
    dismissFlightPassenger(states: StateContext<flightpassengerstate>) {

        let passportValidation = null;
        let passenger = states.getState().selected;
        let pass = this.store.selectSnapshot(OneWaySearchState.getAdult);

        switch (this.store.selectSnapshot(SearchState.getSearchType)) {
            case 'one-way': passportValidation = this.store.selectSnapshot(OneWaySearchState.getTripType); break;
            case 'round-trip': passportValidation = this.store.selectSnapshot(RoundTripSearchState.getTripType); break;
            case 'multi-city': passportValidation = this.store.selectSnapshot(MultiCitySearchState.getTripType); break;
        }

        let missing$ = from(this.alertCtrl.create({
            header: 'Lead Detail Missing',
            subHeader: 'Passport Number or Expiry Date missing',
            id: 'passenger-check',
            buttons: [{
                text: "Ok",
                handler: () => {
                    return true;
                }
            }]
        })).pipe(
            flatMap(
                (missingEl) => {
                    return from(missingEl.present());  
                }
            )
        );

        if (passportValidation == 'international' &&( _.isNull(passenger[0].PassportNo) || _.isNull(passenger[0].PassportExpiry))) {
            return missing$;
        }
        this.modalCtrl.dismiss(null, null, 'passenger-info');
    }

}