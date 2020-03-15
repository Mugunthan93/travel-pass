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
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController
  ) {
    this.initializeApp();
  }

  ngOnInit() {

  }

  initializeApp() {
  }

  onLogout() {
    // this.authService.logout().subscribe(
    //   (resData) => {
    //     this.menuController.close();
    //     this.router.navigate(['/login']);
    //   }
    // );
  }
}

