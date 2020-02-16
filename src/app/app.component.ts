import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

import { Store } from '@ngxs/store';
import { AddUser, RemoveUser } from 'src/app/stores/actions/auth.action';
import { Observable } from 'rxjs';
import { user } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  user$: Observable<user>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private store: Store
  ) {
    this.initializeApp();
    console.log(this.store);
    console.log(this.platform.platforms());


    this.user$ = this.store.select(
      (state) => {
        return state;
      }
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onLogout() {
    this.store.dispatch(new RemoveUser('User is empty'));
    this.authService.logout().subscribe(
      (resData) => {
        this.menuController.close();
        this.router.navigate(['/login']);
      }
    );
  }
}

