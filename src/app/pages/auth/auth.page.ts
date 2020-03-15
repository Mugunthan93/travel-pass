import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  cmpLogo: string = "../assets/logo.jpeg";
  emailPattern: string = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
  loginForm: FormGroup;
  loginSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public loadingCtrl: LoadingController,
    public store: Store
  ) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onLogin() {
    console.log(this.loginForm);
    if (this.loginForm.valid) {
      // this.presentLoading().then(
      //   () => {
      //     this.loginSub = this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      //       .subscribe(
      //         (resData) => {

      //           this.router.navigate(['/', 'booking']);
      //           this.loadingCtrl.dismiss();
      //         }
      //       )
      //   }
      // );
    }
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading... Please wait',
      spinner: 'dots'
    });

    return await loading.present();
  }

  ngOnDestroy(): void {
    if(this.loginSub){
      this.loginSub.unsubscribe();
    }
  }

  authTab(evt){

  }

}
