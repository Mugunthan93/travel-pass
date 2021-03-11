import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { flightpassenger, flightpassengerstate } from "./flight.passenger.states";
import * as _ from 'lodash';
import { append, patch, removeItem, updateItem } from "@ngxs/store/operators";
import { AlertController, ModalController } from "@ionic/angular";
import { UserState } from "../user.state";
import { CompanyState } from "../company.state";
import { from } from "rxjs";
import { flatMap } from "rxjs/operators";
import { CabSearchState } from "../search/cab.state";

export interface cabpassengerstate extends flightpassengerstate{
    passengerList: flightpassenger[]
    passengerCount: number;
    selected: flightpassenger[]
}

////////////////////////////////////////////


export class SetFirstPassengers {
  static readonly type = "[cab_passenger] SetFirstPassengers";
}

export class AddCabPassenger {
  static readonly type = "[cab_passenger] AddPassenger";
  constructor(public pass: flightpassenger) {

  }
}

export class EditCabPassenger {
  static readonly type = "[cab_passenger] EditPassenger";
  constructor(public pass: flightpassenger, public pax: flightpassenger) {

  }
}

export class DeleteCabPassenger {
  static readonly type = "[cab_passenger] DeletePassenger";
  constructor(public pax: flightpassenger) {

  }
}

export class SelectCabPassenger {
  static readonly type = "[cab_passenger] SelectPassenger";
  constructor(public pass: flightpassenger) {

  }
}

export class DeselectCabPassenger {
  static readonly type = "[cab_passenger] DeselectPassenger";
  constructor(public pass: flightpassenger) {

  }
}

export class DismissCabPassenger {
  static readonly type = "[cab_passenger] DismissCabPassenger";
}

@State<cabpassengerstate>({
  name : 'cab_passenger',
  defaults : {
    passengerList: [],
    selected: [],
    passengerCount : 0
  }
})

@Injectable()
export class CabPassengerState {

  constructor(
    private modalCtrl : ModalController,
    private alertCtrl : AlertController,
    private store : Store
  ) {

  }

  @Selector()
    static getPassengers(states: cabpassengerstate): flightpassenger[] {
        return states.passengerList
    }

    @Selector()
    static getLeadPassenger(states: cabpassengerstate): flightpassenger {
        return states.passengerList[0]
    }

    @Selector()
    static getSelectedPassengers(states: cabpassengerstate): flightpassenger[] {
        return states.selected;
    }

    @Selector()
    static getSelected(states: cabpassengerstate): number {
        return states.selected.length;
    }

    @Selector()
    static getCount(states: cabpassengerstate): number {
        return states.passengerCount;
    }

    @Action(AddCabPassenger)
    addPassenger(states: StateContext<cabpassengerstate>, action: AddCabPassenger) {

        let passenger : any = {};
        let fare = null;

        if(!action.pass.IsLeadPax) {
            passenger = _.omit(Object.assign({},action.pass),['GSTCompanyEmail','GSTCompanyAddress','GSTCompanyContactNumber','GSTCompanyName','GSTNumber']);
        }
        else {
          passenger = action.pass;
        }

        states.setState(patch({
            passengerList : append([passenger])
        }));

        this.modalCtrl.dismiss(null, null, 'cab-details');
    }

    @Action(EditCabPassenger)
    editPassenger(states: StateContext<cabpassengerstate>, action: EditCabPassenger) {

        let passenger : any = {};
        let fare = null;

        if(!action.pass.IsLeadPax) {
            passenger = _.omit(Object.assign({},action.pass),['GSTCompanyEmail','GSTCompanyAddress','GSTCompanyContactNumber','GSTCompanyName','GSTNumber']);
        }
        else {
          passenger = action.pass;
        }

        states.setState(patch({
            passengerList : updateItem((el : flightpassenger) => el.FirstName == passenger.FirstName && el.LastName == passenger.LastName && el.Email == passenger.Email,passenger)
        }));

        this.modalCtrl.dismiss(null, null, 'cab-details');
    }

    @Action(DeleteCabPassenger)
    deletePassenger(states: StateContext<cabpassengerstate>, action: DeleteCabPassenger) {
        states.setState(patch({
            passengerList : removeItem((el : flightpassenger) => el.FirstName == action.pax.FirstName && el.LastName == action.pax.LastName && el.Email == action.pax.Email),
            selected : removeItem((el : flightpassenger) => el.FirstName == action.pax.FirstName && el.LastName == action.pax.LastName && el.Email == action.pax.Email)
        }));
    }

    @Action(SetFirstPassengers)
    setFirstPassengers(states: StateContext<cabpassengerstate>) {

        let passengerCount: number = 0;
        let passengers: flightpassenger[] = [];

        passengerCount = parseInt(this.store.selectSnapshot(CabSearchState.getCabForm).passenger);

        passengers[0] = {
            AddressLine1: this.store.selectSnapshot(UserState.getAddress),
            City: this.store.selectSnapshot(UserState.getCity),
            CountryName: this.store.selectSnapshot(UserState.getCountryName),
            CountryCode: null,
            Email: this.store.selectSnapshot(UserState.getEmail),
            onwardExtraServices: {},
            returnExtraServices: {},
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
            GSTNumber: this.store.selectSnapshot(CompanyState.gstNumber)
        }

        states.setState(patch({
            passengerList : append(passengers),
            passengerCount : passengerCount
        }));
    }

    @Action(SelectCabPassenger)
    selectPassenger(states: StateContext<cabpassengerstate>, action: SelectCabPassenger) {
        states.setState(patch({
            selected : append([action.pass])
        }));
    }

    @Action(DeselectCabPassenger)
    deselectPassenger(states: StateContext<cabpassengerstate>, action: DeselectCabPassenger) {
        states.setState(patch({
            selected : removeItem((el : flightpassenger) => el.FirstName == action.pass.FirstName && el.LastName == action.pass.LastName && el.Email == action.pass.Email)
        }));
    }

    @Action(DismissCabPassenger)
    dismissFlightPassenger(states: StateContext<cabpassengerstate>) {

        let passenger = states.getState().selected;

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

        let selection$ = from(this.alertCtrl.create({
          header: 'Select the passengers',
          id: 'passenger-select',
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

      if(passenger.length == 0) {
        return selection$;
      }
      else {
        return from(this.modalCtrl.dismiss(null, null, 'passenger-info'));
      }

    }


}
