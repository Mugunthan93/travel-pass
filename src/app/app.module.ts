import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, HttpHandler } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateManagementModule } from './modules/state-management/state-management.module';
import { InterceptorService } from './services/http/interceptor/interceptor.service';
import { StatusBarService } from './services/status-bar/status-bar.service';
import { SplashScreenService } from './services/splash-screen/splash-screen.service';
import { PlatformService } from './services/platform/platform.service';
import { AuthService } from './services/auth/auth.service';
import { NativeHttpService } from './services/http/native-http/native-http.service';
import { BrowserHttpService } from './services/http/browser-http/browser-http.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StateManagementModule
  ],
  providers: [
    HTTP,
    ScreenOrientation,
    { provide: StatusBarService, useClass: StatusBar },
    { provide: SplashScreenService, useClass: SplashScreen },

    { provide: NativeHttpService, useFactory:HTTP },
    { provide:HttpClient, useClass:BrowserHttpService},

    { 
      provide: BrowserHttpService,
      useFactory:(httpHandler : HttpHandler) => {
        return new BrowserHttpService(httpHandler);
      },
      deps:[HttpHandler]
    },
    { 
      provide: AuthService,
      useFactory:(platform:Platform,http : HTTP) => {
        return new AuthService(platform,http);
      },
      deps:[Platform,HTTP]
    },
    { provide: PlatformService, useClass:Platform},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
