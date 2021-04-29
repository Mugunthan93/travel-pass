import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterState } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { UserIdleService } from 'angular-user-idle';
import { map } from 'jquery';
import { Observable, Subscription } from 'rxjs';
import { Logout } from 'src/app/stores/auth.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy {

  idleSub : Subscription;
  timeoutSub : Subscription;
  router$ : Observable<any>;
  toaster : HTMLIonToastElement;
  countdown : number = 61;

  constructor(
    private store : Store,
    public router : Router,
    private userIdle: UserIdleService,
    public toasterCtrl : ToastController
  ) { }

  async ngOnInit() {
  }

  async touchend(evt : any) {
    console.log(evt);
    if(this.toaster) {
      await this.toaster.dismiss();
      this.userIdle.resetTimer();
    }
  }

  async ionViewWillEnter() {

    //Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.idleSub = this.userIdle.onTimerStart().subscribe(
      async (count) => {
        console.log("count",count);

        if(count == 1) {
          this.toaster = await this.toasterCtrl.create({
            header: 'Inactive Alert',
            message: 'You are Inactive,Do something in ' + this.countdown + ' secound',
            position: 'bottom',
          });
        }


        if(count !== 10) {
          this.toaster.message = 'You are Inactive,Do something in ' + (this.countdown - count) + ' secound';
          await this.toaster.present();
        }
    });

    // Start watch when time is up.
    this.timeoutSub = this.userIdle.onTimeout().subscribe(
      async (timeout) => {
      console.log("timeout",timeout);
      if(timeout) {
        await this.toaster.dismiss();
        this.store.dispatch(new Logout());
      }
    });

  }

  ngOnDestroy(): void {

    if(this.idleSub) {
      this.idleSub.unsubscribe();
    }

    if(this.timeoutSub) {
      this.timeoutSub.unsubscribe();
    }

  }



}
