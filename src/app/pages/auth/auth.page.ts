import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Login } from 'src/app/stores/auth.state';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  cmpLogo: string = "../assets/logo.jpeg";
  emailPattern: string = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public store: Store,
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
    this.store.dispatch(new Navigate(['/', 'auth','forgot-password']));
  }

}
