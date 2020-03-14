import { Injectable } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {

  constructor(
    public splashScreen: SplashScreen
  ) {
  }
}
