import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { FileOpener } from '@ionic-native/file-opener/ngx';


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
    constructor(public booked : string) {

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
        private file: File,
        private transfer: FileTransfer,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private fileOpener: FileOpener
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

        this.menuCtrl.close('first');
        this.store.dispatch(new Navigate(['/', 'home', 'my-booking', states.getState().type, 'new']));

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
    }

    @Action(DownloadTicket)
    async downloadTicket(states: StateContext<booking>, action: DownloadTicket) {

        const fileTransfer: FileTransferObject = this.transfer.create();
        let pnr: string = action.booked;
        const url: string = environment.baseURL + "/ticket/" + pnr + ".pdf";
        const path: string = this.file.externalRootDirectory + '/TravellersPass/Ticket/' + pnr + ".pdf";

        let loadingAlert = await this.loadingCtrl.create({
            message: "Downloading Please wait",
            spinner: "crescent"
        });

        let failedAlert = await this.alertCtrl.create({
            header: 'Download Failed',
            subHeader: 'Error while Downloading file',
            buttons: [
                {
                    text: 'Dismiss',
                    handler: async () => {
                        await failedAlert.dismiss();
                    }
                }
            ]
        });

        await loadingAlert.present();


        try {
            const fileResponse = await fileTransfer.download(url, path);
            console.log(fileResponse);
            let fileUrl = fileResponse.nativeURL;
            await loadingAlert.dismiss();
            let successAlert = await this.alertCtrl.create({
                header: 'Download Success',
                subHeader: 'File Has Been Downloaded',
                buttons: [
                    {
                        text: 'View File',
                        handler: async () => {
                            await this.fileOpener.open(fileUrl, 'application/pdf');
                        }
                    },
                    {
                        text: 'Dismiss',
                        handler: async () => {
                            await successAlert.dismiss();
                        }
                    }
                ]
            });
            await successAlert.present();
        }
        catch (error) {
            console.log(error);
            await loadingAlert.dismiss();
            await failedAlert.present();
        }
    }

}