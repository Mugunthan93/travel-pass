import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { SendConfirmationEmail } from 'src/app/stores/auth.state';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup;

  constructor(
    public modalCtrl: ModalController,
    private store: Store
  ) { }

  ngOnInit() {
    this.emailForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  async sendMail() {
    console.log(this.emailForm.value);
    if (this.emailForm.valid) {
      this.store.dispatch(new SendConfirmationEmail(this.emailForm.value));
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
