import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { UserService } from 'src/app/services/user/user.service';
import { Store } from '@ngxs/store';
import { Signup } from 'src/app/stores/app.state';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers: []
})
export class SignupPage implements OnInit {

  personalForm : FormGroup;
  

  constructor(
    public router: Router,
    public store : Store
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

  onSignup() {
    this.store.dispatch(new Signup(this.personalForm.value));
  }



}
