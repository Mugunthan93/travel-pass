import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { user } from '../models/user';
import { managers } from './book/flight.state';

export class GetUser {
    static readonly type = '[User] GetUser';
    constructor(public user : user) {

    }
}

export class UpdateUser {
    static readonly type = '[User] UpdateUser';
    constructor(public user : user) {

    }
}

@State<user>({
    name: 'user',
    defaults: null
})

export class UserState {

    constructor(
        private store:Store
    ) {

    }

    @Selector()
    static getApproverName(state: user): string {
        return state.approver.name;
    }

    @Selector()
    static getPassportNo(state: user) : string {
        return state.passport_no;
    }

    @Selector()
    static getPassportExpiry(state: user): string {
        return state.passport_expiry;
    }

    @Selector()
    static getDOB(state: user) : string {
        return state.dob;
    }

    @Selector()
    static getTitle(state: user) : string {
        return state.gender;
    }

    @Selector()
    static getContact(state: user): string {
        return state.phone_number
    }

    @Selector()
    static getLastName(state: user) : string {
        return state.lastname;
    }

    @Selector()
    static getFirstName(state: user) : string {
        return state.name
    }

    @Selector()
    static getEmail(state: user) {
        return state.email;
    }

    @Selector()
    static getCountryName(state: user) {
        return state.country_name;
    }


    @Selector()
    static getCity(state : user) {
        return state.city;
    }

    @Selector()
    static getAddress(state : user) {
        return state.address;
    }

    @Selector()
    static isUser(state: user) {
        return state.role == 'kiosk' ? true : false;
    }

    @Selector()
    static isManager(state: user): boolean {
        return state.role == 'manager' ? true : false;
    }

    @Selector()
    static user(state: user): user {
        return state;
    }

    @Selector()
    static getUserId(state: user) : number {
        return state.id;
    }

    @Selector()
    static getApprover(state: user) : managers {
        return {
            id: state.approver.id,
            name: state.approver.name,
            email: state.approver.approver.email
        }
    }

    @Selector()
    static getcompanyId(state: user) : number {
        return state.customer_id
    }

    @Selector()
    static isUserAuthenticated(state: user): boolean {
        return !!state;
    }

    @Action(GetUser)
    getUser(states: StateContext<user>, action: GetUser) {
        states.setState(action.user);
    }

    @Action(UpdateUser)
    updateUser(states: StateContext<user>, action: UpdateUser) {
        states.patchState(action.user);
    }
}