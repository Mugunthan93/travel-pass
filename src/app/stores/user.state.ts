import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { user } from '../models/user';
import { managers } from './book/flight.state';
import { UserService } from '../services/user/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';


export interface updateuser {
    name: string
    lastname: string
    email: string
    designation: string
    phone_number: string
    pan_number: string
    passport_no: string
    passport_expiry: string
    dob: string
    address: string
    gender: string
}

export interface updateresponse {
    status: string,
    message: string,
    data: number[],
    status_code: number
}

export class GetUser {
    static readonly type = '[User] GetUser';
    constructor(public user : user) {

    }
}

export class UpdateUser {
    static readonly type = '[User] UpdateUser';
    constructor(public user : updateuser) {

    }
}

@State<user>({
    name: 'user',
    defaults: null
})

export class UserState {

    constructor(
        private store: Store,
        private userService : UserService
    ) {

    }

    @Selector()
    static getUser(state: user): user {
        return state;
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
        return (state.role == 'manager') || (state.role == 'admin') ? true : false;
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

    @Selector()
    static isAdmin(state: user): boolean {
        return state.approver == null;
    }

    @Selector()
    static getGrade(state : user): string {
        return state.grade;
    }

    @Action(GetUser)
    getUser(states: StateContext<user>, action: GetUser) {
        states.setState(action.user);
    }

    @Action(UpdateUser)
    updateUser(states: StateContext<user>, action: UpdateUser): Observable<void> {

        let currentUser: user = Object.assign(states.getState(), action.user);
        let currentId: number = states.getState().id;

        return this.userService.updateUser(currentId, currentUser)
            .pipe(
                map(
                    (response: updateresponse) => {
                        if (response.status_code == 200)
                        {   
                            states.patchState(currentUser);
                            console.log("update succesfully");
                        }
                    }
                )
            )

    }
}