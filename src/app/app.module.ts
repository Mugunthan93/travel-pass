import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, STORAGE_ENGINE, StorageOption } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { InterceptorService } from './services/interceptor.service';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { AppState } from './stores/app.state';
import { customStorage } from './stores/customStorage';
import { storageOptionsFactory } from '@ngxs/storage-plugin/src/internals';

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
    NgxsModule.forRoot([AppState], { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot({
      key : 'App',
      deserialize :JSON.parse,
      serialize : JSON.stringify
    }),
    NgxsFormPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      disabled: false,
      collapsed: true
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'App',
      disabled: true
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: STORAGE_ENGINE, useClass: customStorage }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
