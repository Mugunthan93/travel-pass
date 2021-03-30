import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ofActionCompleted, Store } from '@ngxs/store';
import { Login } from 'src/app/stores/auth.state';
import { ModalController } from '@ionic/angular';
import { ForgotPasswordComponent } from 'src/app/components/flight/forgot-password/forgot-password.component';
import { Navigate } from '@ngxs/router-plugin';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  cmpLogo: string = environment.baseURL + "/image/logo_black.png";
  emailPattern: string = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
  loginForm: FormGroup;
  formSubmit: boolean = false;

  constructor(
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
    this.formSubmit = true;
    if(this.loginForm.valid) {
      this.store.dispatch(new Login(this.loginForm.value.email, this.loginForm.value.password))
        .subscribe((res) => {
          console.log("completed",res);
          this.loginForm.reset();
          this.formSubmit = false;
        });
    }
  }

  async forgotPassword() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordComponent,
      cssClass: 'baggage'
    });

    return await modal.present();
  }

  ngOnDestroy(): void {
  }

}
