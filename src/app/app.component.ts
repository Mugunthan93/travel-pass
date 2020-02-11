import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { Platforms } from '@ionic/core/dist/types/utils/platform.d';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  platformName : string[];

  constructor(
    private platform: Platform,
    private authService : AuthService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private menuController : MenuController
  ) {
    this.platformName = this.platform.platforms();
    this.checkPlatform();
    this.initializeApp();
    console.log(this.menuController);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkPlatform() {
    this.platformName.forEach(
      (platform) => {
        if(this.platform.is(platform as Platforms)){
          console.log(platform + " is working");
        }
      }
    );
  }

  onLogout() {
    this.authService.logout().subscribe(
      (resData) => {
        console.log(resData);
        this.router.navigate(["./login"]);
      }
    );
  }
}
