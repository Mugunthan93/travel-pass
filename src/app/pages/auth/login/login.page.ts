import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Login } from 'src/app/stores/auth.state';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ModalController } from '@ionic/angular';
import { ForgotPasswordComponent } from 'src/app/components/flight/forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  emailPattern: string = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
  loginForm: FormGroup;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) {

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onLogin() {
    this.store.dispatch(new Login(this.loginForm.value.email, this.loginForm.value.password))
      .subscribe({
        complete: () => this.loginForm.reset()
      });
  }

  async forgotPassword() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordComponent,
      cssClass:'baggage'
    });

    return await modal.present();

  }

}
