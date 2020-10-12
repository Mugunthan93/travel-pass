import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddBusPassenger, buspassenger, EditBusPassenger } from 'src/app/stores/passenger/bus.passenger.state';
import { BusResultState, seat } from 'src/app/stores/result/bus.state';
import { ProofValidator } from 'src/app/validator/proof.validator';

@Component({
  selector: 'app-bus-passenger-detail',
  templateUrl: './bus-passenger-detail.component.html',
  styleUrls: ['./bus-passenger-detail.component.scss'],
})
export class BusPassengerDetailComponent implements OnInit {


  @Input() form: string;
  @Input() pax: buspassenger;
  @Input() lead: boolean;

  travellerForm: FormGroup;

  titles: string[] = ['Mr','Ms','Mrs'];
  ages: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  idtype: string[] = ['Aadhar Card', 'Voter ID Card', 'Driving License', 'PAN Card', 'Passport'];
  seats$: Observable<seat[]>;
  seats: seat[];

  regex: any = {
    alphaonly: "^[A-Za-z]+$",
    email: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    phone_number: "^[0-9]{10}$",
    aadhar: "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$",
    voter:"^([a-zA-Z]){3}([0-9]){7}?$",
    pan: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
    passport: "^(?!^0+$)[a-zA-Z0-9]{6,9}$"
  }

  formsubmit: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    private store: Store
  ) { }

  ngOnInit() {

    this.seats$ = this.store.select(BusResultState.getselectedSeat);
    this.seats = this.store.selectSnapshot(BusResultState.getselectedSeat)
      .filter(el => el.id == this.pax.seatNbr)

    if (this.form == 'add') {
      this.travellerForm = new FormGroup({
        title: new FormControl(null, [Validators.required]),
        name: new FormControl(null, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        lastName: new FormControl(null, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        age: new FormControl(null, [Validators.required]),
        prefSeat: new FormControl(null,[Validators.required]),
        email: new FormControl(null, this.lead ? [Validators.required] : []),
        mobile: new FormControl(null, this.lead ? [Validators.required] : []),
        idType: new FormControl('PAN Card', [Validators.required]),
        idNumber: new FormControl(null,[Validators.required,,ProofValidator('Pan Card')]),
        Address: new FormControl(null, this.lead ? [Validators.required] : [])
      });
    }
    else if (this.form == 'edit') {
      this.travellerForm = new FormGroup({

        title: new FormControl(this.pax.sex == 'M' ? 'Mr' : 'Ms', [Validators.required]),
        name: new FormControl(this.pax.name, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        lastName: new FormControl(this.pax.lastName, [Validators.required, Validators.pattern(this.regex.alphaonly)]),
        age: new FormControl(this.pax.age, [Validators.required]),
        prefSeat: new FormControl(this.seats[0], [Validators.required]),
        email: new FormControl(this.pax.email, this.lead ? [Validators.required] : []),
        mobile: new FormControl(this.pax.mobile, this.lead ? [Validators.required] : []),
        idType: new FormControl(this.pax.idType, [Validators.required]),
        idNumber: new FormControl(this.pax.idNumber, [Validators.required, ProofValidator(this.pax.idType)]),

        Address: new FormControl(this.pax.Address, this.lead ? [Validators.required] : []),
      });
      
    }

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
        this.store.dispatch(new AddBusPassenger(this.travellerForm.value));
      }
      else if (this.form == 'edit') {
        this.store.dispatch(new EditBusPassenger(this.travellerForm.value,this.pax));
      }
    }
  }
  
  selectedTitle(evt: CustomEvent) {
    this.travellerForm.controls['title'].patchValue(evt.detail.value);
  }

  selectedProofType(evt: CustomEvent) {
    this.travellerForm.controls['idType'].patchValue(evt.detail.value);
    this.travellerForm.controls['idNumber'].setValidators([Validators.required, ProofValidator(evt.detail.value)]);
    this.travellerForm.controls['idNumber'].updateValueAndValidity();
  }

  selectedSeat(evt: CustomEvent) {
    this.travellerForm.controls['prefSeat'].patchValue(evt.detail.value);
  }

  closeTraveller() {
    this.modalCtrl.dismiss(null, null, 'bus-details');
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
