import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { FlightService } from '../services/flight/flight.service';
import { UserState } from './user.state';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { BookingService } from '../services/booking/booking.service';
import { forkJoin, from, iif } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import * as _ from 'lodash';

export interface booking {
    type: string
    new: any[]
    history: any[]
    loading : boolean
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

export class ViewFile {
    static readonly type = "[booking] ViewFile";
    constructor(public pnr : string) {

    }
}

@State<booking>({
    name: 'booking',
    defaults: {
        type: 'flight',
        new: [],
        history: [],
        loading: true
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

    @Selector()
    static getLoading(state : booking) : boolean {
        return state.loading;
    }

    @Action(MyBooking)
    myBooking(states: StateContext<booking>, action: MyBooking) {

        states.patchState({
            new: [],
            history: [],
            type : action.type
        });

        states.dispatch(new Navigate(['/', 'home', 'my-booking', action.type, 'new']));

        let newBooking = [];
        let historyBooking = [];

        let menuclose$ = from(this.menuCtrl.isOpen('first'));
        let openBooking$ = this.bookingService.myBooking(action.type,'open');
        let newBooking$ = this.bookingService.myBooking(action.type,'new');
        let pendingBooking$ = this.bookingService.myBooking(action.type,'pending');
        let bookedBooking$ = this.bookingService.myBooking(action.type,'booked');
        let grabbedBooking$ = this.bookingService.myBooking(action.type,'grabbed');

        let trainBooking$ = forkJoin(menuclose$,newBooking$,pendingBooking$,bookedBooking$,grabbedBooking$);
        let otherBooking$ = forkJoin(menuclose$,openBooking$,pendingBooking$,bookedBooking$);

        return iif(
            () => action.type == 'train', trainBooking$,otherBooking$
        ).pipe(
            flatMap(
                (response) => {
                    console.log(response);
                    let neworopenArray = _.isUndefined(JSON.parse(response[1].data).data) ? [] : JSON.parse(response[1].data).data;
                    let pendingArray = _.isUndefined(JSON.parse(response[2].data).data) ? [] : JSON.parse(response[2].data).data;
                    let bookedArray = _.isUndefined(JSON.parse(response[3].data).data) ? [] : JSON.parse(response[3].data).data;

                    if(response[4]) {
                        let grabbedArray = _.isUndefined(JSON.parse(response[4].data).data) ? [] : JSON.parse(response[4].data).data;
                        newBooking.push(...neworopenArray,...pendingArray,...grabbedArray);
                        historyBooking.push(...bookedArray);
                    }
                    else {
                        newBooking.push(...neworopenArray,...pendingArray);
                        historyBooking.push(...bookedArray);
                    }

                    let newbook = null;
                    let historybook = null;

                    if(action.type == 'train') {
                        newbook = _.uniqBy(newBooking,'id').filter(el => action.type == 'train' && !_.isString(el.train_requests));
                        historybook = _.uniqBy(historyBooking,'id').filter(el => action.type == 'train' && !_.isString(el.train_requests));
                    }
                    else {
                        newbook = _.uniqBy(newBooking,'id');
                        historybook = _.uniqBy(historyBooking,'id');  
                    }


                    console.log(newbook,historybook);
                    states.patchState({
                        new: newbook,
                        history:historybook,
                        type : action.type,
                        loading : false
                    });

                    if(response[0]){
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

    @Action(ViewFile)
    viewFile(states: StateContext<booking>, action: ViewFile) {
        
        const failedAlert$ = from(this.alertCtrl.create({
            header: 'File Error',
            subHeader: 'File Not Found',
            buttons: [
              {
                text: 'Retry',
                handler: () => {
                  this.store.dispatch(new DownloadTicket(action.pnr));
                }
              }
            ]
          }))
          .pipe(
              map(
                  (alert) => {
                    return from(alert.present());
                  }
              )
          );
        let fileopener$ = from(this.fileOpener.open(this.file.externalRootDirectory + '/TravellersPass/Ticket/' + action.pnr + ".pdf", 'application/pdf'));

        return fileopener$.pipe(
            catchError(
                (error) => {
                    if(error.status == 9) {
                        return failedAlert$;
                    }
                }
            )
        );
    }

}