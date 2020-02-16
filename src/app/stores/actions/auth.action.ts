import { user, login } from 'src/app/models/user';

export class AddUser {
    static readonly type = '[Auth] Add';
    constructor(public payload: login) {
    }
}

export class RemoveUser {
    static readonly type = '[Auth] Remove';
    constructor(public payload: string) {
    }
}