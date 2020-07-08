import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { Observable, Subscription } from 'rxjs';
import { File } from '@ionic-native/file/ngx';


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
    private androidFullScreen: AndroidFullScreen,
    public alertCtrl: AlertController,
    private file : File
  ) {
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.androidFullScreen.immersiveMode();

    try {
      await this.file.checkDir(this.file.externalRootDirectory, 'TravellersPass');
      await this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass','Ticket');
    }
    catch (error) {
      if (error.code == 1) {
        await this.file.createDir(this.file.externalRootDirectory, 'TravellersPass', true);
        await this.file.createDir(this.file.externalRootDirectory + 'TravellersPass','Ticket', true);    
      }
    }

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

