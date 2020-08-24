import { State, Store, Action, StateContext } from '@ngxs/store';
import { managers, user_eligibility } from './flight.state';
import { busResponse, droppingPoint, boardingPoint, BusResultState } from '../result/bus.state';
import { BusSearchState } from '../search/bus.state';
import { ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { CompanyState } from '../company.state';
import { GST } from './flight/oneway.state';
import { UserState } from '../user.state';
import * as moment from 'moment';
import { BookMode } from '../book.state';


export interface busbook {
    passenger_details: passenger_details
    bus_requests: busrequests[]


    transaction_id: any
    user_id: number
    customer_id: number
    booking_mode: string
    trip_type: string
    comments: string
    purpose: string
    cancellation_charges: any
    approval_mail_cc: string[]
    status: string
    managers: managers
}

export interface passenger_details {
    blockSeatPaxDetails: blockseat[]
    selectedbus: busResponse[]
    fareDetails: fareDetails
    userEligibility: user_eligibility
}

export interface blockseat {
    primary: boolean,
    email: string,
    name: string,
    lastName: string,
    Address: string,
    mobile: string,
    idType: string,
    idNumber: string,
    title: string,
    sex: string,
    age: string,
    seatNbr: any,
    fare: number,
    serviceTaxAmount: number,
    operatorServiceChargeAbsolute: number,
    totalFareWithTaxes: number,
    ladiesSeat: boolean,
    nameOnId: string,
    ac: boolean,
    sleeper: boolean,
    prefSeat: string
}

export interface fareDetails {
    total_amount: number,
    service_Charges: number,
    sgst_Charges: number,
    cgst_Charges: number,
    markup_Charges: number,
    igst_Charges: number
}

export interface busrequests {
    inventoryType: number
    routeScheduleId: string
    sourceCity: string
    destinationCity: string
    doj: string
    droppingPoint: droppingPoint
    boardingPoint: boardingPoint
}

////////////////////////////////////////////////////////////////

export class GetBookDetail {
    static readonly type = "[bus_book] GetBookDetail";
    constructor(public currentbus : busResponse,public boarding : boardingPoint, public dropping: droppingPoint) {

    }
}


@State<busbook>({
    name: 'bus_book',
    defaults: {
        passenger_details: null,
        bus_requests: [],
        transaction_id: null,
        user_id: null,
        customer_id: null,
        booking_mode: null,
        trip_type: null,
        comments: null,
        purpose: null,
        cancellation_charges: null,
        approval_mail_cc: [],
        status: null,
        managers: null
    }
})
export class BusBookState {

    constructor(
        private store: Store,
        public modalCtrl : ModalController
    ) {

    }

    @Action(GetBookDetail)
    getBookDetail(states: StateContext<busbook>, action: GetBookDetail) {

        let busrequest: busrequests = Object.assign({}, {
            inventoryType: action.currentbus.inventoryType,
            routeScheduleId: action.currentbus.routeScheduleId,
            sourceCity: this.store.selectSnapshot(BusSearchState.getPayload).sourceCity,
            destinationCity: this.store.selectSnapshot(BusSearchState.getPayload).destinationCity,
            doj: this.store.selectSnapshot(BusSearchState.getPayload).doj,
            droppingPoint: action.boarding,
            boardingPoint: action.dropping
        });

        let currenReq: busrequests[] = Object.assign([],states.getState().bus_requests);
        currenReq.push(busrequest);

        let leadPassenger: blockseat = {
            primary: true,
            email: this.store.selectSnapshot(UserState.getEmail),
            name: this.store.selectSnapshot(UserState.getFirstName),
            lastName: this.store.selectSnapshot(UserState.getLastName),
            Address: this.store.selectSnapshot(UserState.getAddress),
            mobile: this.store.selectSnapshot(UserState.getContact),
            idType: 'PAN Card',
            idNumber: this.store.selectSnapshot(UserState.getPassportNo),
            title: this.store.selectSnapshot(UserState.getTitle) == 'Female' ? 'Ms' : 'Mr',
            sex: this.store.selectSnapshot(UserState.getTitle) == 'Female' ? 'F' : 'M',
            age: moment().diff(this.store.selectSnapshot(UserState.getDOB), 'years', false).toString(),
            seatNbr: null,
            fare: parseInt(action.currentbus.fare),
            serviceTaxAmount: 54.5,
            operatorServiceChargeAbsolute: 0,
            totalFareWithTaxes: parseInt(action.currentbus.fare) + 54.5,
            ladiesSeat: this.store.selectSnapshot(BusResultState.getselectedSeat)[0].ladiesSeat,
            nameOnId: this.store.selectSnapshot(UserState.getFirstName),
            ac: this.store.selectSnapshot(BusResultState.getselectedSeat)[0].ac,
            sleeper: this.store.selectSnapshot(BusResultState.getselectedSeat)[0].sleeper,
            prefSeat: this.store.selectSnapshot(BusResultState.SeatNumbers)[0]
        }

        let passenger_details: passenger_details = {
            blockSeatPaxDetails: [leadPassenger],
            selectedbus: [action.currentbus],
            fareDetails: {
                total_amount: parseInt(action.currentbus.fare) * this.store.selectSnapshot(BusSearchState.getPassengersCount),
                service_Charges: this.serviceCharges(),
                sgst_Charges: this.GST().sgst,
                cgst_Charges: this.GST().cgst,
                igst_Charges: this.GST().igst,
                markup_Charges: this.store.selectSnapshot(CompanyState.getBusMarkupCharge)
            },
            userEligibility: {
                msg: null,
                company_type: 'corporate'
            }
        }

        states.patchState({
            passenger_details : passenger_details,
            bus_requests: currenReq
        });

        this.modalCtrl.dismiss(null, null, 'seat-select');
        this.modalCtrl.dismiss(null, null, 'pick-drop');
        states.dispatch(new BookMode('bus'));
        states.dispatch(new Navigate(['/', 'home', 'book', 'bus']));
        
    }

    serviceCharges(): number {
        let serviceCharge: number = 0;
        serviceCharge = this.store.selectSnapshot(CompanyState.getBusServiceCharge) * this.store.selectSnapshot(BusSearchState.getPassengersCount);
        return serviceCharge;
    }

    GST(): GST {
        if (this.store.selectSnapshot(CompanyState.getStateName) == 'Tamil Nadu') {
            return {
                cgst: (this.serviceCharges() * 9) / 100,
                sgst: (this.serviceCharges() * 9) / 100,
                igst: 0
            }
        }
        else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'Tamil Nadu') {
            return {
                cgst: 0,
                sgst: 0,
                igst: (this.serviceCharges() * 18) / 100
            }
        }
    }


    

}