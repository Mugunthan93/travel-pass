import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';


export interface booking {
    type: string
    new: any[]
    history: any[]
}

export class MyBooking {
    static readonly type = "[booking] MyBooking";
    constructor(public type : string) {

    }
}

export class DownloadTicket {
    static readonly type = "[booking] DownloadTicket";
    constructor(public booked : any) {

    }
}

@State<booking>({
    name: 'booking',
    defaults: {
        type: null,
        new: null,
        history: null
    }
})
export class BookingState {

    constructor(
        private store: Store,
        public menuCtrl: MenuController,
        private flightService: FlightService,
        private fliePath: FilePath,
        private file: File,
        private transfer: FileTransfer
    ) {

    }

    @Selector()
    static getNewBooking(state: booking) : any[] {
        return state.new;
    }

    @Selector()
    static getHistoryBooking(state: booking) : any[] {
        return state.history;
    }

    @Action(MyBooking)
    async myflightBooking(states: StateContext<booking>, action: MyBooking) {

        states.patchState({
            type : action.type
        });

        let newBooking = [];
        let historyBooking = [];

        ///open try catch
        try {
            const userId: number = this.store.selectSnapshot(UserState.getUserId);
            const myBookingResponse = await this.flightService.openBooking(userId);
            let openBooking = JSON.parse(myBookingResponse.data);
            console.log(openBooking);
            newBooking.push(...openBooking.data);
        }
        catch (error) {
            console.log(error);
        }

        /// pending try catch
        try {
            const userId: number = this.store.selectSnapshot(UserState.getUserId);
            const myBookingResponse = await this.flightService.pendingBooking(userId);
            let pendingBooking = JSON.parse(myBookingResponse.data);
            console.log(pendingBooking);
            newBooking.push(...pendingBooking.data);
        }
        catch (error) {
            console.log(error);
        }


        //rej try catch
        try {
            const userId: number = this.store.selectSnapshot(UserState.getUserId);
            const myBookingResponse = await this.flightService.rejBooking(userId);
            let rejBooking = JSON.parse(myBookingResponse.data);
            console.log(rejBooking);
            newBooking.push(...rejBooking.data);
        }
        catch (error) {
            console.log(error);
        }

        //booked try catch
        try {
            const userId: number = this.store.selectSnapshot(UserState.getUserId);
            const myBookingResponse = await this.flightService.bookedBooking(userId);
            let bookedBooking = JSON.parse(myBookingResponse.data);
            console.log(bookedBooking);
            historyBooking.push(...bookedBooking.data);
        }
        catch (error) {
            console.log(error);
        }

        states.patchState({
            new: newBooking,
            history:historyBooking
        });

        this.menuCtrl.close('first');
        this.store.dispatch(new Navigate(['/', 'home', 'my-booking', states.getState().type, 'new']));
    }

    @Action(DownloadTicket)
    async downloadTicket(states: StateContext<booking>, action: DownloadTicket) {

        const fileTransfer: FileTransferObject = this.transfer.create();

        let pnrString: string = action.booked.passenger_details.PNR;
        let pnr: string = pnrString.substring(2, pnrString.length - 2);
        
        const url: string = environment.baseURL + "/ticket/" + pnr + ".pdf";
        const path: string = this.file.externalDataDirectory + pnr + ".pdf";

        try {
            const fileResponse = await fileTransfer.download(url, path);
            console.log(fileResponse);
        }
        catch (error) {
            console.log(error);
        }

        // try {
        //     const ticketResponse = await this.flightService.downloadTicket(pnr, path);
        //     console.log(ticketResponse.data);
        // }
        // catch (error) {
        //     console.log(error); 
        // }
    }

}