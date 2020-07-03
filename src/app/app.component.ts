import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  onConnect$: Observable<any>;
  onChange$: Observable<any>;
  onChangeSub: Subscription;

  constructor(
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private network: Network,
    private androidFullScreen: AndroidFullScreen,
    public alertCtrl: AlertController
  ) {

    this.onChange$ = this.network.onChange();
    this.onConnect$ = this.network.onConnect();
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.androidFullScreen.immersiveMode();
  }

  async networkAccess() {
    try {
      const networkpermission = this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE;
      const permission = await this.androidPermissions.checkPermission(networkpermission);
      if (permission) {
        await this.androidPermissions.requestPermission(networkpermission);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  async writeAccess() {
    try {
      const writeExtStorage = this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE;
      const permission = await this.androidPermissions.hasPermission(writeExtStorage);
      if (!permission) {
        await this.androidPermissions.requestPermission(writeExtStorage);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    
  }

}

