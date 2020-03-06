import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

import { Store,ofActionDispatched, Actions } from '@ngxs/store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private store: Store,
    private actions : Actions
  ) {
    this.initializeApp();
    console.log(this.store,this.actions);
  }

  ngOnInit() {

  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("device is ready");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onLogout() {
    this.authService.logout().subscribe(
      (resData) => {
        this.menuController.close();
        this.router.navigate(['/login']);
      }
    );
  }
}

