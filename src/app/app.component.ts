import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { File } from '@ionic-native/file/ngx';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ThemeState } from './stores/theme.stata';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


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
    private splashscreen : SplashScreen,
    public alertCtrl: AlertController,
    private file: File
  ) {
  }

  async ngOnInit() {

    await this.platform.ready();
    await this.androidFullScreen.immersiveMode();
    this.theme$ = this.store.select(ThemeState.getTheme);
    this.splashscreen.hide();

    //access
    await this.Access('ACCESS_NETWORK_STATE');
    await this.Access('WRITE_EXTERNAL_STORAGE');

    //folder check
    await this.checkFolder('','TravellersPass');
    await this.checkFolder('TravellersPass','Ticket');
    await this.checkFolder('TravellersPass','Image');
    await this.checkFolder('TravellersPass/Image','Hotel');
  }

  async checkFolder(path : string,dir : string) {
    try {
      return await this.file.checkDir(this.file.externalRootDirectory + path, dir);
    }
    catch(error) {
      await this.file.createDir(this.file.externalRootDirectory + path, dir, true);
    }
  }

  async Access(perm : string) {
    try {
      const permission = this.androidPermissions.PERMISSION[perm];
      const check = await this.androidPermissions.checkPermission(permission);
      if (check) {
        await this.androidPermissions.requestPermission(permission);
      }
      else {
        return;
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


