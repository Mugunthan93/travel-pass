import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AddCabPassenger, EditCabPassenger } from 'src/app/stores/passenger/cab.passenger.state';
import { flightpassenger } from 'src/app/stores/passenger/flight.passenger.states';

@Component({
  selector: 'app-pass-detail',
  templateUrl: './pass-detail.component.html',
  styleUrls: ['./pass-detail.component.scss'],
})
export class PassDetailComponent implements OnInit {

  @Input() form: string;
  @Input() pax: flightpassenger;
  @Input() lead: boolean;

  cabForm : FormGroup;
  formsubmit: boolean;

  constructor(
    private store : Store,
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {

    this.formsubmit = false;

    if (this.form == 'add') {
      this.cabForm = new FormGroup({
        FirstName: new FormControl(null),
        LastName: new FormControl(null),
        Email: new FormControl(null),
        ContactNo: new FormControl(null),
        AddressLine1: new FormControl(null),
        GSTCompanyName: new FormControl(null),
        GSTNumber: new FormControl(null),
        GSTCompanyEmail: new FormControl(null),
        GSTCompanyAddress: new FormControl(null),
        GSTCompanyContactNumber: new FormControl(null),
      });
    }
    else if(this.form == 'edit') {
      this.cabForm = new FormGroup({
        FirstName: new FormControl(this.pax.FirstName),
        LastName: new FormControl(this.pax.LastName),
        Email: new FormControl(this.pax.Email),
        ContactNo: new FormControl(this.pax.ContactNo),
        AddressLine1: new FormControl(this.pax.AddressLine1),
        GSTCompanyName: new FormControl(this.pax.GSTCompanyName),
        GSTNumber: new FormControl(this.pax.GSTNumber),
        GSTCompanyEmail: new FormControl(this.pax.GSTCompanyEmail),
        GSTCompanyAddress: new FormControl(this.pax.GSTCompanyAddress),
        GSTCompanyContactNumber: new FormControl(this.pax.GSTCompanyContactNumber),
      });
    }


  }

  passSubmit() {
    this.formsubmit = true;
    console.log(this.cabForm);
    if (this.cabForm.valid) {
      if (this.form == 'add') {
        this.store.dispatch(new AddCabPassenger(this.cabForm.value));
      }
      else if (this.form == 'edit') {
        this.store.dispatch(new EditCabPassenger(this.cabForm.value,this.pax));
      }
    }
  }

  close() {
    this.modalCtrl.dismiss(null,null,'cab-details');
  }

}
