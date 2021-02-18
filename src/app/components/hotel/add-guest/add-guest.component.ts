import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { hotelpassenger, AddAdultPassenger, AddChildPassenger, EditAdultPassenger, EditChildPassenger } from 'src/app/stores/passenger/hotel.passenger.state';
import { ModalController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss'],
})
export class AddGuestComponent implements OnInit {

  @Input() form: string
  @Input() pax: hotelpassenger
  @Input() paxtype: string
  @Input() lead: boolean;

  passengerForm: FormGroup;
  customAlertOptions: AlertOptions;
  ages: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  regex: any = {
    alphaonly: "^[A-Za-z]+$",
    email: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    phone_number: "^[0-9]{10}$",
    passport: "^(?!^0+$)[a-zA-Z0-9]{6,9}$",
    gst: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
    pan: "[A-Z]{5}[0-9]{4}[A-Z]{1}"
  }

  emailValid: ValidatorFn[];
  panValid: ValidatorFn[];
  childValid: ValidatorFn[];

  formsubmit: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    private store: Store
  ) { }

  ngOnInit() {

    this.emailValid = this.paxtype == "1" ? [Validators.required, Validators.pattern(this.regex.email)] : [];
    this.panValid = this.paxtype == "1" ? [Validators.required,Validators.pattern(this.regex.pan)] : [];
    this.childValid = this.paxtype == "2" ? [Validators.required] : [];

    this.customAlertOptions = {
      header: 'Child Age',
      cssClass: 'cabinClass'
    }

    if (this.form == 'add') {
      this.passengerForm = new FormGroup({
        first_name: new FormControl(null, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        last_name: new FormControl(null, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        email: new FormControl(null, this.emailValid),
        pan: new FormControl(null, this.panValid),
        age: new FormControl(null, this.childValid)
      });
    }
    else if (this.form == 'edit') {
      this.passengerForm = new FormGroup({
        first_name: new FormControl(this.pax.FirstName, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        last_name: new FormControl(this.pax.LastName, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        email: new FormControl(this.pax.Email, this.emailValid),
        pan: new FormControl(this.pax.PAN, this.panValid),
        age: new FormControl(this.pax.Age, this.childValid)
      });
    }

    this.passengerForm.valueChanges.subscribe(el => console.log(el));

  }

  passSubmit() {
    this.formsubmit = true;
    console.log(this.passengerForm);
    if (this.passengerForm.valid) {

      if (this.paxtype == '1') {

        let adult: hotelpassenger = {
          PaxType: parseInt(this.paxtype),
          LeadPassenger:this.lead,
          count:0,
          FirstName: this.passengerForm.value.first_name,
          LastName: this.passengerForm.value.last_name,
          Email: this.passengerForm.value.email,
          PAN: this.passengerForm.value.pan
        }

        if (this.form == 'add') {
          this.store.dispatch(new AddAdultPassenger(adult));
        }
        else if (this.form == 'edit') {
          this.store.dispatch(new EditAdultPassenger(adult,this.pax));
        }
      }
      else if (this.paxtype == '2') {
        let child: hotelpassenger = {
          PaxType: parseInt(this.paxtype),
          LeadPassenger: this.lead,
          count: 0,
          FirstName: this.passengerForm.value.first_name,
          LastName: this.passengerForm.value.last_name,
          Age: this.passengerForm.value.age
        }

        if (this.form == 'add') {
          this.store.dispatch(new AddChildPassenger(child));
        }
        else if (this.form == 'edit') {
          this.store.dispatch(new EditChildPassenger(child, this.pax));
        }
      }
    }
  }

  selectedAge(evt : CustomEvent) {
    this.passengerForm.controls['age'].patchValue(evt.detail.value);
  }

  closeGuest() {
    this.modalCtrl.dismiss(null, null,'guest-details');
  }

}
