import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { GetRequest } from 'src/app/stores/book/train/multi-city.state';
import { trainmulticityform, TrainMultiCitySearchState } from 'src/app/stores/search/train/multi-city.state';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  multicityForm: Observable<trainmulticityform[]>;
  multicitylength: number;
  types: string[] = ['Normal', 'Thakal'];
  
  bookForm: FormGroup;
  formsubmit: boolean = false;
  train_name: FormArray;

  constructor(
    private store: Store,
    public modalCtrl : ModalController,
    public fb : FormBuilder
  ) { }

  ngOnInit() {
    this.multicityForm = this.store.select(TrainMultiCitySearchState.getMulticityForm);
    this.multicitylength = this.store.selectSnapshot(TrainMultiCitySearchState.getMulticityForm).length;
    this.bookForm = new FormGroup({
      'train_name': this.createTrip(),
      'book_type': new FormControl(null, [Validators.required])
    });

    this.train_name = this.bookForm.get('train_name') as FormArray;
    console.log(this.bookForm);
  }

  createTrip(): FormArray {

    let arr = new FormArray([]);
    let i = 0;

    while(i < this.multicitylength) {
      arr.setControl(i,this.fb.group({
          name: this.fb.control(null, [Validators.required]),
        })
      );
      i++;
    }

    console.log(arr);
    return arr;

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

  trainname(evt: CustomEvent,control :FormGroup) {
    console.log(control);
    control.controls['name'].patchValue(evt.detail.value);
    // this.store.dispatch(new GetTrainName(evt.detail.value));
  }

  errorClass(control : FormGroup) {
    console.log(control);
    return {
      'initial': (control.controls['name'].value == null) && !this.formsubmit,
      'valid is-valid':
      control.controls['name'].value !== null ||
        (control.controls['name'].valid && !this.formsubmit) ||
        (control.controls['name'].valid && this.formsubmit),
      'invalid is-invalid':
        (control.controls['name'].invalid && this.formsubmit)
    }
  }

  errorTypeClass(name : string) {
    return {
      'initial': (this.bookForm.controls[name].value == null) && !this.formsubmit,
      'valid':
        this.bookForm.controls[name].value !== null ||
        (this.bookForm.controls[name].valid && !this.formsubmit) ||
        (this.bookForm.controls[name].valid && this.formsubmit),
      'invalid':
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
