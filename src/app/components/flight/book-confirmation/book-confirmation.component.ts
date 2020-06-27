import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SendRequest, MailCC, Purpose } from 'src/app/stores/book/flight/oneway.state';
import { AlertOptions } from '@ionic/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-book-confirmation',
  templateUrl: './book-confirmation.component.html',
  styleUrls: ['./book-confirmation.component.scss'],
})
export class BookConfirmationComponent implements OnInit {

  ccAlertOptions: AlertOptions;
  purposeAlertOptions: AlertOptions;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {

    this.ccAlertOptions = {
      cssClass: 'cc'
    }

    this.purposeAlertOptions = {
      cssClass: 'purpose'
    }

  }

  mail(evt : CustomEvent) {
    this.store.dispatch(new MailCC(evt.detail.value));
  }
  
  purpose(evt: CustomEvent) {
    this.store.dispatch(new Purpose(evt.detail.value));
  }

  comment(evt: CustomEvent) {
    this.store.dispatch(new Comment(evt.detail.value));
  }

  sendRequest() {
    // this.store.dispatch(new SendRequest(this.request.value));
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
