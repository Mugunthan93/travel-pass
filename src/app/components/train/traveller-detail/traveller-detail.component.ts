import { Component, OnInit, Input } from '@angular/core';
import { trainpassenger, AddTrainPassenger, EditTrainPassenger } from 'src/app/stores/passenger/train.passenger.state';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ValidatorFn, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertOptions } from '@ionic/core';

@Component({
  selector: 'app-traveller-detail',
  templateUrl: './traveller-detail.component.html',
  styleUrls: ['./traveller-detail.component.scss'],
})
export class TravellerDetailComponent implements OnInit {

  @Input() form: string;
  @Input() pax: trainpassenger;
  @Input() paxtype: string
  @Input() lead: boolean;

  travellerForm: FormGroup;

  titles: string[] = ['Mr','Ms','Mrs'];
  ages: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  idtype: string[] = ['Aadhar Card', 'Voter ID Card', 'Driving License', 'PAN Card', 'Passport'];
  seats: string[] = ['Seat','Berth'];

  regex: any = {
    alphaonly: "^[A-Za-z]+$",
    email: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    phone_number: "^[0-9]{10}$",
    aadhar: "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$",
    voter:"^([a-zA-Z]){3}([0-9]){7}?$",
    pan: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
    passport: "^(?!^0+$)[a-zA-Z0-9]{6,9}$"
  }

  idNumberValid = () => {
    let type = this.travellerForm.controls['idType'].value;
    switch (type) {
      case 'Aadhar Card': return [Validators.required, Validators.pattern(this.regex.aadhar)];
      case 'Voter ID Card': return [Validators.required, Validators.pattern(this.regex.voter)];
      case 'Driving License': return [Validators.required];
      case 'PAN Card': return [Validators.required, Validators.pattern(this.regex.pan)];
      case 'Passport': return [Validators.required, Validators.pattern(this.regex.passport)];
      default: return [Validators.required];
    }
  }

  formsubmit: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    private store: Store
  ) { }

  ngOnInit() {

    if (this.form == 'add') {
      this.travellerForm = new FormGroup({
        title: new FormControl(null, [Validators.required]),
        first_name: new FormControl(null, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        last_name: new FormControl(null, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        idType: new FormControl(null, [Validators.required]),
        idNumber: new FormControl(null),
        age: new FormControl(null, [Validators.required]),
        preferred_seat: new FormControl(null,[Validators.required]),

        email: new FormControl(null, this.lead ? [Validators.required] : []),
        phone_number: new FormControl(null, this.lead ? [Validators.required] : []),
        address: new FormControl(null, this.lead ? [Validators.required] : [])
      });
    }
    else if (this.form == 'edit') {
      this.travellerForm = new FormGroup({

        title: new FormControl(this.pax.sex == 'M' ? 'Mr' : 'Ms', [Validators.required]),
        first_name: new FormControl(this.pax.name, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        last_name: new FormControl(this.pax.lastName, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        idType: new FormControl(this.pax.idType, [Validators.required]),
        idNumber: new FormControl(this.pax.idNumber),
        age: new FormControl(this.pax.age, [Validators.required]),
        preferred_seat: new FormControl(this.pax.prefSeat, [Validators.required]),


        email: new FormControl(this.pax.email, this.lead ? [Validators.required] : []),
        phone_number: new FormControl(this.pax.mobile, this.lead ? [Validators.required] : []),
        address: new FormControl(this.pax.Address, this.lead ? [Validators.required] : []),
      });

    }
    this.travellerForm.controls['idNumber'].setValidators(this.idNumberValid);
    this.travellerForm.valueChanges.subscribe(el => console.log(el));

  }

  interfaceOption(header : string) {
    return {
      header: header,
      cssClass: 'cabinClass'
    }
  }

  passSubmit() {
    this.formsubmit = true;
    console.log(this.travellerForm);
    if (this.travellerForm.valid) {
      if (this.form == 'add') {
        this.store.dispatch(new AddTrainPassenger(this.travellerForm.value));
      }
      else if (this.form == 'edit') {
        this.store.dispatch(new EditTrainPassenger(this.travellerForm.value,this.pax));
      }
    }
  }

  selectedAge(evt: CustomEvent) {
    this.travellerForm.controls['age'].patchValue(evt.detail.value);
  }
  
  selectedTitle(evt: CustomEvent) {
    this.travellerForm.controls['title'].patchValue(evt.detail.value);
  }

  selectedProofType(evt: CustomEvent) {
    this.travellerForm.controls['idType'].patchValue(evt.detail.value);
  }

  selectedSeat(evt: CustomEvent) {
    this.travellerForm.controls['preferred_seat'].patchValue(evt.detail.value);
  }

  closeTraveller() {
    this.modalCtrl.dismiss(null, null, 'traveller-details');
  }

  errorClass(name : string) {
    return {
      'initial': (this.travellerForm.controls[name].value == null) && !this.formsubmit,
      'valid is-valid':
        this.travellerForm.controls[name].value !== null ||
        // (this.travellerForm.controls[name].valid && !this.formsubmit) ||
        (this.travellerForm.controls[name].valid && this.formsubmit),
      'invalid is-invalid':
        (this.travellerForm.controls[name].invalid && this.formsubmit)
    }
  }

}
