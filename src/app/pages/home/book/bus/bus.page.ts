import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PaymentComponent } from 'src/app/components/bus/payment/payment.component';
import { Observable } from 'rxjs';
import { busResponse, BusResultState, seat } from 'src/app/stores/result/bus.state';
import { Store } from '@ngxs/store';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { BusSearchState } from 'src/app/stores/search/bus.state';
import { BusBookState, fareDetails } from 'src/app/stores/book/bus.state';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';
import { GetSendRequest } from 'src/app/stores/book.state';

@Component({
  selector: "app-bus",
  templateUrl: "./bus.page.html",
  styleUrls: ["./bus.page.scss"],
})
export class BusPage implements OnInit {
  busDetail$: Observable<busResponse>;
  totalSeat$: Observable<number>;
  fare$: Observable<number>;
  selectedSeat$: Observable<seat[]>;

  fareDetail$: Observable<fareDetails>;

  constructor(private store: Store, public modalCtrl: ModalController) {}

  ngOnInit() {
    this.busDetail$ = this.store.select(BusResultState.getCurrentBus);
    this.totalSeat$ = this.store.select(BusSearchState.getPassengersCount);
    this.fare$ = this.store.select(BusBookState.getFare);
    this.fareDetail$ = this.store.select(BusBookState.getFareDetail);
    this.selectedSeat$ = this.store.select(BusResultState.getselectedSeat);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerListComponent,
      keyboardClose: false,
      id: 'passenger-info',
    });

    modal.onDidDismiss().then((resData) => {
      console.log(resData);
    });

    return await modal.present();
  }

  sendRequest() {
    this.store.dispatch(new GetSendRequest(BookConfirmationComponent));
  }
}
