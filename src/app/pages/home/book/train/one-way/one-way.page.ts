import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { trainonewayform, TrainOneWaySearchState } from 'src/app/stores/search/train/oneway.state';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { GetRequest } from 'src/app/stores/book/train/one-way.state';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  onewayForm: Observable<trainonewayform>;
  types: string[] = ['Normal', 'Thakal'];
  
  bookForm: FormGroup;
  formsubmit: boolean = false;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.onewayForm = this.store.select(TrainOneWaySearchState.getOnewaySearch);
    this.bookForm = new FormGroup({
      'train_name': new FormControl(null,[Validators.required]),
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

  trainname(evt: CustomEvent) {
    this.bookForm.controls['train_name'].patchValue(evt.detail.value);
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
      this.store.dispatch(new GetRequest(this.bookForm.value.train_name, this.bookForm.value.book_type));
      const modal = await this.modalCtrl.create({
        component: BookConfirmationComponent,
        id: 'book-confirm'
      });

      return await modal.present();
    }
  }

}
