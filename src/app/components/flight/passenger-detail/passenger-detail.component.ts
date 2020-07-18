import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealBaggageComponent } from '../meal-baggage/meal-baggage.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddPassenger, passenger, addPassenger, EditPassenger, FLightBookState } from 'src/app/stores/book/flight.state';
import * as moment from 'moment';
import { BookState } from 'src/app/stores/book.state';
import { Observable } from 'rxjs';
import { company } from 'src/app/models/company';
import { CompanyState } from 'src/app/stores/company.state';
import { CityModalComponent } from '../../shared/city-modal/city-modal.component';
import { city } from 'src/app/stores/shared.state';

@Component({
  selector: 'app-passenger-detail',
  templateUrl: './passenger-detail.component.html',
  styleUrls: ['./passenger-detail.component.scss'],
})
export class PassengerDetailComponent implements OnInit {

  @Input() form: string;
  @Input() pax: passenger;

  company: company;

  formSubmit: boolean = false;
  Passenger: FormGroup;
  type: string;

  selectedCity: city;

  constructor(
    private store : Store,
    public modalCtrl: ModalController,
    private flightBookState : FLightBookState,
  ) { }

  ngOnInit() {

    this.company = this.store.selectSnapshot(CompanyState.getCompany);

    if (this.form == 'add') {
      this.Passenger = new FormGroup({
        "Title": new FormControl(null,[Validators.required]),
        "FirstName": new FormControl(null, [Validators.required]),
        "LastName": new FormControl(null,[Validators.required]),
        "Email": new FormControl(null, [Validators.required]),
        "DateOfBirth": new FormControl(null, [Validators.required]),
        "Address": new FormControl(null, [Validators.required]),
        "City": new FormControl(null, [Validators.required]),
        "ContactNo": new FormControl(null, [Validators.required]),
        "PassportNo": new FormControl(null,[Validators.required]),
        "nationality": new FormControl(null),
        "PassportExpiry": new FormControl(null,[Validators.required]),
        "ftnumber": new FormControl(null),
        "CompanyName": new FormControl(this.company.company_name, [Validators.required]),
        "CompanyEmail": new FormControl(this.company.company_email, [Validators.required]),
        "GSTNumber": new FormControl(this.company.gst_details.gstNo, [Validators.required]),
        "CompanyAddress": new FormControl(this.company.company_address_line1, [Validators.required]),
        "CompanyNumber": new FormControl(this.company.phone_number, [Validators.required])
      });
    }
    else if (this.form == 'edit'){
      this.Passenger = new FormGroup({
        "Title": new FormControl(this.pax.Title, [Validators.required]),
        "FirstName": new FormControl(this.pax.FirstName, [Validators.required]),
        "LastName": new FormControl(this.pax.LastName, [Validators.required]),
        "Email": new FormControl(this.pax.Email, [Validators.required]),
        "DateOfBirth": new FormControl(this.pax.DateOfBirth, [Validators.required]),
        "Address": new FormControl(this.pax.AddressLine1, [Validators.required]),
        "City": new FormControl(this.pax.City, [Validators.required]),
        "ContactNo": new FormControl(this.pax.ContactNo, [Validators.required]),
        "PassportNo": new FormControl(this.pax.PassportNo, [Validators.required]),
        "nationality": new FormControl(this.pax.nationality),
        "PassportExpiry": new FormControl(this.pax.PassportExpiry, [Validators.required]),
        "ftnumber": new FormControl(this.pax.ftnumber),
        "CompanyName": new FormControl(this.pax.GSTCompanyName, [Validators.required]),
        "CompanyEmail": new FormControl(this.pax.GSTCompanyEmail, [Validators.required]),
        "GSTNumber": new FormControl(this.pax.GSTNumber, [Validators.required]),
        "CompanyAddress": new FormControl(this.pax.GSTCompanyAddress, [Validators.required]),
        "CompanyNumber": new FormControl(this.pax.GSTCompanyContactNumber, [Validators.required])
      });
    }

    this.type = this.store.selectSnapshot(BookState.getBookType);

    this.Passenger.valueChanges.subscribe(el => console.log(el));

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

  async selectCity(field) {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        this.selectedCity = selectedCity.data;
        if (selectedCity.role == "backdrop") {
          return;
        }
        this.Passenger.controls[field].patchValue(selectedCity.data.city_name);
      }
    );

    return await modal.present();
  }

  addPassenger() {
    this.formSubmit = true;
    if (this.Passenger.valid) {
      let passenger: passenger = {
        Title: this.Passenger.value.Title,
        FirstName: this.Passenger.value.FirstName,
        LastName: this.Passenger.value.LastName,
        Email: this.Passenger.value.Email,
        DateOfBirth: moment.utc(this.Passenger.value.DateOfBirth).format('YYYY-MM-DD hh:mm:ss A Z'),
        AddressLine1: this.Passenger.value.Address,
        City: this.Passenger.value.City,
        ContactNo: this.Passenger.value.ContactNo,
        PassportNo: this.Passenger.value.PassportNo,
        PassportExpiry: moment.utc(this.Passenger.value.DateOfBirth).format('YYYY-MM-DD hh:mm:ss A Z'),
        nationality: this.Passenger.value.nationality,
        ftnumber: this.Passenger.value.ftnumber,
        GSTCompanyName: this.Passenger.value.CompanyName,
        GSTCompanyEmail: this.Passenger.value.CompanyEmail,
        GSTNumber: this.Passenger.value.GSTNumber,
        GSTCompanyAddress: this.Passenger.value.CompanyAddress,
        GSTCompanyContactNumber: this.Passenger.value.CompanyNumber,
        CountryCode: this.selectedCity.country_code,
        CountryName:this.selectedCity.country_name,
        onwardExtraServices: {
          Meal: [],
          MealTotal: 0,
          BagTotal: 0,
          Baggage: []
        },
        returnExtraServices: {
          Meal: [],
          MealTotal: 0,
          BagTotal: 0,
          Baggage: []
        },
        Gender: this.flightBookState.getGender(this.Passenger.value.Title),
        PaxType: 1,
        IsLeadPax: this.leadPax(this.form,this.pax),
        Fare: this.store.selectSnapshot(FLightBookState.getFare)
      }
      if (this.form == 'add') {
        this.store.dispatch(new AddPassenger(passenger));
      }
      else if (this.form == 'edit') {
        this.store.dispatch(new EditPassenger(passenger,this.pax));
      }
    }
  }

  leadPax(formType : string,pax : passenger) : boolean {
    if (formType == 'edit') {
      if (this.store.selectSnapshot(FLightBookState.getLeadPassenger).IsLeadPax == this.pax.IsLeadPax) {
        return this.pax.IsLeadPax;
      }
      else {
        return false;
      }
    }
    else {
      return false;
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
