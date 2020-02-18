import { login } from 'src/app/models/auth';

export class AddUser {
    static readonly type = '[User] AddUser';
    constructor(public payload : login) {}
}

export class RemoveUser {
    static readonly type = '[User] RemoveUser';
}