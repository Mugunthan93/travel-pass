import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';

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
import { UserState } from './stores/auth.action';

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
    NgxsModule.forRoot([UserState],{ developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot({
      disabled : true,
      collapsed : true
    }),
    NgxsFormPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass:InterceptorService, multi:true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
