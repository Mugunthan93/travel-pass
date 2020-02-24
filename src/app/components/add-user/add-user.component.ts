import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {

  @Output() closeUser = new EventEmitter<boolean>();

  userSignupForm : FormGroup;

  constructor() { }

  ngOnInit() {
    this.userSignupForm = new FormGroup({
      name : new FormControl(),
      mobile_number : new FormControl(),
      email_id : new FormControl(),
      approver_name : new FormControl(),
      role : new FormControl()
    });
  }

  onSubmit() {
    this.closeUser.emit(false);
  }

}
