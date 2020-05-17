import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from './services/auth/auth.service';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  constructor(
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private authService: AuthService,
    private network: Network
  ) {
  }

  async ngOnInit() {
    await this.platform.ready();
    console.log(this.androidPermissions.PERMISSION);
    await this.networkAccess();
    console.log(this.network);
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

