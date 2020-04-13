import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss'],
})
export class AddProfileComponent implements OnInit {

  @Output() closeProfile: EventEmitter<boolean> = new EventEmitter<boolean>();

  profileForm: FormGroup;

  constructor(
  ) { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      name: new FormControl(),
      mobile_number: new FormControl(),
      dob: new FormControl(),
      pan_number: new FormControl(),
      aadhar_number: new FormControl(),
      self_address: new FormControl(),
      emergency_contact: new FormControl(),
      passport_number: new FormControl()

    })
  }

  onSignup() {
    this.closeProfile.emit(true);
  }

}
