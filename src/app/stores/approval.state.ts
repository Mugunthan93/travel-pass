import { State, Action, StateContext, Store } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController } from '@ionic/angular';


export interface Approval {
    type: string
    list : any
}

export class ApprovalRequest {
    static readonly type = "[approval] ApprovalRequest";
    constructor(public type: string) {

    }
}

@State<Approval>({
    name: 'approval',
    defaults: {
        type: 'flight',
        list: null
    }
})
export class ApprovalState {

    constructor(
        private store: Store,
        public menuCtrl : MenuController
    ) {

    }

    @Action(ApprovalRequest)
    approveRequest(states: StateContext<Approval>, action: ApprovalRequest) {
        states.patchState({
            type: action.type
        });
        this.menuCtrl.toggle('first');
        this.store.dispatch(new Navigate(['/', 'home', 'approval-request', states.getState().type, 'request-list']));
    }


}