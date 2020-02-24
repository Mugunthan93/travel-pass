import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers: []
})
export class SignupPage implements OnInit {

  personalForm : FormGroup;
  

  constructor(
    public router: Router
  ) {
    
    this.personalForm = new FormGroup({
      name: new FormControl(),
      mobile_number: new FormControl(),
      bussiness_email_id: new FormControl(),
      company_name: new FormControl(),
      company_address: new FormControl(),
      gst_number: new FormControl()
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {

  }

  onSignup() {

  }

}
