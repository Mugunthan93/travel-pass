import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Signup } from 'src/app/stores/auth.state';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers: []
})
export class SignupPage implements OnInit {

  personalForm: FormGroup;
  onlyalphaRegex: string = '^[a-zA-Z]+$';
  emailRegex: string = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
  gstRegex: string = "^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$";
  phoenNumberRegex: string = "^[0-9]{10}$";

  constructor(
    public router: Router,
    public authService : AuthService,
    public store: Store,
  ) {
    this.personalForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(this.onlyalphaRegex)]),
      mobile_number: new FormControl(null, [Validators.required, Validators.pattern(this.phoenNumberRegex)]),
      bussiness_email_id: new FormControl(null, [Validators.required,Validators.email, Validators.pattern(this.emailRegex)]),
      company_name: new FormControl(null, [Validators.required, Validators.pattern(this.onlyalphaRegex)]),
      company_address: new FormControl(null, [Validators.required]),
      gst_number: new FormControl(null, [Validators.required, Validators.pattern(this.gstRegex)])
    });
  }

  ngOnInit() {
  }

  async onSignup() {
    console.log(this.personalForm);
    this.store.dispatch(new Signup(this.personalForm.value));
  }



}
