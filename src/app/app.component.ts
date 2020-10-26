import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { File } from '@ionic-native/file/ngx';
import { concat, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ThemeState } from './stores/theme.stata';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  theme$ : Observable<string>;

  constructor(
    private store : Store,
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private androidFullScreen: AndroidFullScreen,
    public alertCtrl: AlertController,
    private file: File
  ) {
  }

  async ngOnInit() {

    this.theme$ = this.store.select(ThemeState.getTheme);
    await this.platform.ready();
    await this.androidFullScreen.immersiveMode();

    // let checkDir$ = concat([
    //   from(this.file.checkDir(this.file.externalRootDirectory, 'TravellersPass')),
    //   from(this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass', 'Ticket')),
    //   from(this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass', 'Image')),
    //   from(this.file.checkDir(this.file.externalRootDirectory + 'TravellersPass/Image', 'Hotel'))
    // ]).pipe(flatMap(el => el));

    // let creatrDir$ = concat([
    //   from(this.file.createDir(this.file.externalRootDirectory, 'TravellersPass', true)),
    //   from(this.file.createDir(this.file.externalRootDirectory + 'TravellersPass', 'Ticket', true)),
    //   from(this.file.createDir(this.file.externalRootDirectory + 'TravellersPass', 'Image', true)),
    //   from(this.file.createDir(this.file.externalRootDirectory + 'TravellersPass/Image', 'Hotel', true))
    // ]).pipe(flatMap(el => of(true)));


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

  getTheme() : Observable<string> {
    return this.theme$;
  }

  ngOnDestroy() {
  }

}

