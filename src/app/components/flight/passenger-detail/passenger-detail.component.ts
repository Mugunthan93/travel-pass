import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealBaggageComponent } from '../meal-baggage/meal-baggage.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddPassenger, passenger, addPassenger, EditPassenger } from 'src/app/stores/book/flight.state';
import * as moment from 'moment';
import { BookState } from 'src/app/stores/book.state';

@Component({
  selector: 'app-passenger-detail',
  templateUrl: './passenger-detail.component.html',
  styleUrls: ['./passenger-detail.component.scss'],
})
export class PassengerDetailComponent implements OnInit {

  @Input() form: string;
  @Input() pax: passenger;

  formSubmit: boolean = false;
  Passenger: FormGroup;
  type: string;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {

    if (this.form == 'add') {
      this.Passenger = new FormGroup({
        "Title": new FormControl(null,[Validators.required]),
        "FirstName": new FormControl(null,[Validators.required]),
        "LastName": new FormControl(null),
        "DateOfBirth": new FormControl(null),
        "ContactNo": new FormControl(null),
        "PassportNo": new FormControl(null,[Validators.required]),
        "PassportExpiry": new FormControl(null,[Validators.required]),
        "nationality": new FormControl(null),
        "ftnumber": new FormControl(null)
      });
    }
    else if (this.form == 'edit'){
      this.Passenger = new FormGroup({
        "Title": new FormControl(this.pax.Title, [Validators.required]),
        "FirstName": new FormControl(this.pax.FirstName, [Validators.required]),
        "LastName": new FormControl(this.pax.LastName),
        "DateOfBirth": new FormControl(this.pax.DateOfBirth),
        "ContactNo": new FormControl(this.pax.ContactNo),
        "PassportNo": new FormControl(this.pax.PassportNo, [Validators.required]),
        "PassportExpiry": new FormControl(this.pax.PassportExpiry, [Validators.required]),
        "nationality": new FormControl(this.pax.nationality),
        "ftnumber": new FormControl(this.pax.ftnumber)
      });
    }

    this.type = this.store.selectSnapshot(BookState.getBookType);

   }
  
  async addMeal() {
    const modal = await this.modalCtrl.create({
      component: MealBaggageComponent,
      id: 'passenger-meal',
      componentProps: {

      }
    });

    return await modal.present();
  }

  addPassenger() {
    this.formSubmit = true;
    if (this.Passenger.valid) {
      let passenger: addPassenger = {
        Title: this.Passenger.value.Title,
        FirstName: this.Passenger.value.FirstName,
        LastName: this.Passenger.value.LastName,
        DateOfBirth: moment.utc(this.Passenger.value.DateOfBirth).format('YYYY-MM-DD hh:mm:ss A Z'),
        ContactNo: this.Passenger.value.ContactNo,
        PassportNo: this.Passenger.value.PassportNo,
        PassportExpiry: moment.utc(this.Passenger.value.DateOfBirth).format('YYYY-MM-DD hh:mm:ss A Z'),
        nationality: this.Passenger.value.nationality,
        ftnumber: this.Passenger.value.ftnumber
      }
      if (this.form == 'add') {
        this.store.dispatch(new AddPassenger(passenger));
      }
      else if (this.form == 'edit') {
        this.store.dispatch(new EditPassenger(passenger,this.pax));
      }
    }
  }

  dismissDetail() {
    this.modalCtrl.dismiss(null, null, 'passenger-details');
  }

  errorClass(name: string) {
    return {
      'initial': (this.Passenger.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.Passenger.controls[name].value !== null ||
        (this.Passenger.controls[name].valid && !this.formSubmit) ||
        (this.Passenger.controls[name].valid && this.formSubmit),
      'invalid':
        (this.Passenger.controls[name].invalid && this.formSubmit)
    }
  }

}
