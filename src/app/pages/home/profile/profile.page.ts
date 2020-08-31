import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { user } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { UserState, UpdateUser } from 'src/app/stores/user.state';
import { Navigate } from '@ngxs/router-plugin';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user$: Observable<user>;
  editMode: boolean = false;
  edituser: FormGroup;

  regex: any = {
    alphaonly: "^[A-Za-z]+$",
    email: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    phone_number: "^[0-9]{10}$",
    passport: "^(?!^0+$)[a-zA-Z0-9]{6,9}$",
    gst: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
  }

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.user$ = this.store.select(UserState.getUser);

    this.user$.subscribe(
      (user : user) => {
        this.edituser = new FormGroup({
          'first_name': new FormControl(user.name, [Validators.required, Validators.minLength(3), Validators.pattern(this.regex.alphaonly)]),
          'last_name': new FormControl(user.lastname, [Validators.required, Validators.minLength(3), Validators.pattern(this.regex.alphaonly)]),
          'email': new FormControl(user.email, [Validators.required, Validators.pattern(this.regex.email)]),
          'designation': new FormControl(user.designation, [Validators.required]),
          'phone_number': new FormControl(user.phone_number, [Validators.required, Validators.pattern(this.regex.phone_number)]),
          'pan_number': new FormControl(user.pan_number, [Validators.required]),
          'passport_no': new FormControl(user.passport_no, [Validators.required, Validators.pattern(this.regex.passport)]),
          'passport_expiry': new FormControl(user.passport_expiry, [Validators.required]),
          'dob': new FormControl(user.dob, [Validators.required]),
          'address': new FormControl(user.address, [Validators.required]),
          'gender': new FormControl(user.gender, [Validators.required])
        });
      }
    );

  }

  editUser() {
    this.editMode = true;
    this.user$.subscribe(
      (user: user) => {

        this.edituser.controls['first_name'].patchValue(user.name);
        this.edituser.controls['last_name'].patchValue(user.lastname);
        this.edituser.controls['email'].patchValue(user.email);
        this.edituser.controls['designation'].patchValue(user.designation);
        this.edituser.controls['phone_number'].patchValue(user.phone_number);
        this.edituser.controls['pan_number'].patchValue(user.pan_number);
        this.edituser.controls['passport_no'].patchValue(user.passport_no);
        this.edituser.controls['passport_expiry'].patchValue(user.passport_expiry);
        this.edituser.controls['dob'].patchValue(user.dob);
        this.edituser.controls['address'].patchValue(user.address);
        this.edituser.controls['gender'].patchValue(user.gender);
      }
    );
  }

  saveUser() {
    if (this.edituser.valid) {
      console.log(this.edituser.value);

      this.store.dispatch(new UpdateUser(this.edituser.value))
        .subscribe({
          complete: () => {
            this.user$.subscribe(
              (user: user) => {

                this.edituser.controls['first_name'].patchValue(user.name);
                this.edituser.controls['last_name'].patchValue(user.lastname);
                this.edituser.controls['email'].patchValue(user.email);
                this.edituser.controls['designation'].patchValue(user.designation);
                this.edituser.controls['phone_number'].patchValue(user.phone_number);
                this.edituser.controls['pan_number'].patchValue(user.pan_number);
                this.edituser.controls['passport_no'].patchValue(user.passport_no);
                this.edituser.controls['passport_expiry'].patchValue(user.passport_expiry);
                this.edituser.controls['dob'].patchValue(user.dob);
                this.edituser.controls['address'].patchValue(user.address);
                this.edituser.controls['gender'].patchValue(user.gender);

                this.editMode = false;
              }
            );
          }
        });
    }
  }

  cancel() {
    this.editMode = false;
  }

  back() {
    this.store.dispatch(new Navigate(['/','home','dashboard','home-tab']));
  }

}
