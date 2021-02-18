import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { GetRequest } from 'src/app/stores/book/train/round-trip.state';
import { trainroundtrip, TrainRoundTripSearchState } from 'src/app/stores/search/train/round-trip.state';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {
  
  departureForm: Observable<trainroundtrip>;
  returnForm: Observable<trainroundtrip>;
  types: string[] = ['Normal', 'Thakal'];
  
  bookForm: FormGroup;
  formsubmit: boolean = false;


  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.departureForm = this.store.select(TrainRoundTripSearchState.getDeparture);
    this.returnForm = this.store.select(TrainRoundTripSearchState.getReturn);
    this.bookForm = new FormGroup({
      'departure_train_name': new FormControl(null,[Validators.required]),
      'return_train_name': new FormControl(null,[Validators.required]),
      'book_type': new FormControl(null, [Validators.required])
    });
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerListComponent,
      keyboardClose: false,
      id: 'passenger-info'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

  trainname(evt: CustomEvent,type : string) {
    this.bookForm.controls[type + '_train_name'].patchValue(evt.detail.value);
    // this.store.dispatch(new GetTrainName(evt.detail.value));
  }

  errorClass(name: string) {
    return {
      'initial': (this.bookForm.controls[name].value == null) && !this.formsubmit,
      'valid is-valid':
        this.bookForm.controls[name].value !== null ||
        (this.bookForm.controls[name].valid && !this.formsubmit) ||
        (this.bookForm.controls[name].valid && this.formsubmit),
      'invalid is-invalid':
        (this.bookForm.controls[name].invalid && this.formsubmit)
    }
  }

  interfaceOption(header: string) {
    return {
      header: header,
      cssClass: 'cabinClass'
    }
  }

  selectedBookType(evt: CustomEvent) {
    this.bookForm.controls['book_type'].patchValue(evt.detail.value);
    // this.store.dispatch(new TrainBookType(evt.detail.value));
  }

  async sendRequest() {
    this.formsubmit = true;
    console.log(this.bookForm);
    if (this.bookForm.valid) {
      this.store.dispatch(new GetRequest(this.bookForm.value.departure_train_name,this.bookForm.value.return_train_name, this.bookForm.value.book_type));
      const modal = await this.modalCtrl.create({
        component: BookConfirmationComponent,
        id: 'book-confirm'
      });

      return await modal.present();
    }
  }

}
