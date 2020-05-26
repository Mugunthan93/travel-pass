import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP } from '@ionic-native/http/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NativeHttpService } from './services/http/native-http/native-http.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { StateModule } from './modules/state.module';
import { Network } from '@ionic-native/network/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';


@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode:'md',
      scrollPadding: false,
      scrollAssist: false
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    StateModule
  ],
  providers: [
    Platform,
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    Network,
    AndroidFullScreen,
    HTTP,
    {
      provide: NativeHttpService,
      useFactory: (platform : Platform,http : HTTP) => {
        return new NativeHttpService(platform,http);
      },
      deps:[Platform,HTTP]
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
