import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ff_number, user } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { UserState, UpdateUser } from 'src/app/stores/user.state';
import { Navigate } from '@ngxs/router-plugin';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: user;
  editMode: boolean = false;
  edituser: FormGroup;

  regex: any = {
    alphaonly: "^[A-Za-z]+$",
    email: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    phone_number: "^[0-9]{10}$",
    passport: "^(?!^0+$)[a-zA-Z0-9]{6,9}$",
    gst: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
  }

  flightnum : FormArray;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.user = this.store.selectSnapshot(UserState.getUser);

    this.edituser = new FormGroup({
      'name': new FormControl(this.user.name, [Validators.required, Validators.minLength(3), Validators.pattern(this.regex.alphaonly)]),
      'lastname': new FormControl(this.user.lastname, [Validators.required, Validators.minLength(3), Validators.pattern(this.regex.alphaonly)]),
      'email': new FormControl(this.user.email, [Validators.required, Validators.pattern(this.regex.email)]),
      'designation': new FormControl(this.user.designation, [Validators.required]),
      'phone_number': new FormControl(this.user.phone_number, [Validators.required, Validators.pattern(this.regex.phone_number)]),
      'PAN_number': new FormControl(this.user.PAN_number, [Validators.required]),
      'passport_no': new FormControl(this.user.passport_no, [Validators.required, Validators.pattern(this.regex.passport)]),
      'passport_expiry': new FormControl(this.user.passport_expiry, [Validators.required]),
      'dob': new FormControl(this.user.dob, [Validators.required]),
      'address': new FormControl(this.user.address, [Validators.required]),
      'gender': new FormControl(this.user.gender, [Validators.required]),
      'frequent_flyer_number' : new FormArray(this.addFlyerFlightNumber(this.user.frequent_flyer_number))
    });

    this.flightnum = this.edituser.get('frequent_flyer_number') as FormArray;

  }

  addFlyerFlightNumber(num : ff_number[]) {
    if(num == null) {
      return [this.createNum()];
    }
    else {
      return num.map(
        (el) => {
          return new FormGroup({
            key : new FormControl(el.key),
            value : new FormControl(el.value)
          });
        }
      );
    }

  }

  editUser() {
    this.editMode = true;
    this.edituser.controls['name'].patchValue(this.user.name);
    this.edituser.controls['lastname'].patchValue(this.user.lastname);
    this.edituser.controls['email'].patchValue(this.user.email);
    this.edituser.controls['designation'].patchValue(this.user.designation);
    this.edituser.controls['phone_number'].patchValue(this.user.phone_number);
    this.edituser.controls['PAN_number'].patchValue(this.user.PAN_number);
    this.edituser.controls['passport_no'].patchValue(this.user.passport_no);
    this.edituser.controls['passport_expiry'].patchValue(this.user.passport_expiry);
    this.edituser.controls['dob'].patchValue(this.user.dob);
    this.edituser.controls['address'].patchValue(this.user.address);
    this.edituser.controls['gender'].patchValue(this.user.gender);
    this.edituser.controls['frequent_flyer_number'].patchValue(this.user.frequent_flyer_number);
  }

  saveUser() {
    console.log(this.edituser);
    if (this.edituser.valid) {

      this.store.dispatch(new UpdateUser(this.edituser.value))
        .subscribe({
          complete: () => {
            this.editMode = false;
          }
        });
    }
  }

  showffnum() {
    return this.flightnum.value.length !== 0;
  }

  createNum() {
    return new FormGroup({
      key : new FormControl(null,[Validators.required]),
      value : new FormControl(null,[Validators.required])
    })
  }

  addnum() {
    this.flightnum.push(this.createNum());
  }

  removenum(ind : number) {
    this.flightnum.removeAt(ind);
  }

  cancel() {
    this.editMode = false;
  }

  back() {
    this.store.dispatch(new Navigate(['/','home','dashboard','home-tab']));
  }

}
