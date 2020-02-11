import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit,OnDestroy {

  cmpLogo : string = "../assets/logo.png";
  emailPattern : string = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
  loginForm : FormGroup;
  loginSub : Subscription;

  constructor(
    public authService : AuthService,
    public router : Router,
    public loadingCtrl : LoadingController
  ) {
   }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email : new FormControl(null,[Validators.required,Validators.pattern(this.emailPattern)]),
      password : new FormControl(null,[Validators.required])
    });
  }

  onLogin() {
    console.log(this.loginForm);
    if(this.loginForm.valid)
    {
      this.presentLoading().then(
        () => {
          this.loginSub = this.authService.login(this.loginForm.value.email,this.loginForm.value.password)
          .subscribe(
            (resData) => {
              console.log(resData);
              this.loadingCtrl.dismiss();
              this.router.navigate([resData]);
            }
          )
        }
      );
      
    }
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message : 'Loading... Please wait',
      spinner : 'dots'
    });

    return await loading.present();
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }

}
