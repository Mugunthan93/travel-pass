import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  constructor(
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private androidFullScreen: AndroidFullScreen,
    public alertCtrl: AlertController,
    private file: File
  ) {
  }

  async ngOnInit() {
    console.log(this.platform);
    await this.platform.ready();
    await this.androidFullScreen.immersiveMode();

    try {
      await this.file.checkDir(this.file.externalRootDirectory, 'TravellersPass');
      await this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass', 'Ticket');
      await this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass', 'Image');
      await this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass/Image', 'Hotel');
    }
    catch (error) {
      if (error.code == 1) {
        await this.file.createDir(this.file.externalRootDirectory, 'TravellersPass', true);
        await this.file.createDir(this.file.externalRootDirectory + 'TravellersPass', 'Ticket', true);
        await this.file.createDir(this.file.externalRootDirectory + 'TravellersPass', 'Image', true);
        await this.file.createDir(this.file.externalRootDirectory + 'TravellersPass/Image', 'Hotel', true);
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

