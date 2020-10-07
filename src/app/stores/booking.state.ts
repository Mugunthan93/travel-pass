import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { BookingService } from '../services/booking/booking.service';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import * as _ from 'lodash';

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
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private bookingService : BookingService,
        private file: File,
        private transfer: FileTransfer,
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

    @Selector()
    static getType(state : booking) : string {
        return state.type;
    }

    @Action(MyBooking)
    myBooking(states: StateContext<booking>, action: MyBooking) {

        states.dispatch(new Navigate(['/', 'home', 'my-booking', states.getState().type, 'new']));
        let newBooking = [];
        let historyBooking = [];

        const userId: number = this.store.selectSnapshot(UserState.getUserId);        
        let menuclose$ = this.menuCtrl.isOpen('first');
        let openBooking$ = this.bookingService.myBooking(action.type,userId,'open');
        let pendingBooking$ = this.bookingService.myBooking(action.type,userId,'pending');
        let rejBooking$ = this.bookingService.myBooking(action.type,userId,'rej');
        let bookedBooking$ = this.bookingService.myBooking(action.type,userId,'booked');

        return forkJoin(menuclose$,openBooking$,pendingBooking$,rejBooking$,bookedBooking$)
            .pipe(
                map(
                    (response) => {
                        let openArray = _.isUndefined(JSON.parse(response[1].data).data) ? [] : JSON.parse(response[1].data).data;
                        let pendingArray = _.isUndefined(JSON.parse(response[2].data).data) ? [] : JSON.parse(response[2].data).data;
                        let rejArray = _.isUndefined(JSON.parse(response[3].data).data) ? [] : JSON.parse(response[3].data).data;
                        let bookedArray = _.isUndefined(JSON.parse(response[4].data).data) ? [] : JSON.parse(response[4].data).data;

                        newBooking.push(...openArray,...pendingArray,...rejArray);
                        historyBooking.push(...bookedArray);

                        console.log(openArray,pendingArray,rejArray);
                        states.patchState({
                            new: _.uniqBy(newBooking,'id'),
                            history:_.uniqBy(historyBooking,'id'),
                            type : action.type
                        });

                        if(response[0]) {
                            return from(this.menuCtrl.close('first'));
                        }
                    }
                )
            );
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