import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateManagementModule } from './modules/state-management/state-management.module';
import { InterceptorService } from './services/http/interceptor/interceptor.service';
import { HttpService } from './services/http/http.service';
import { StatusBarService } from './services/status-bar/status-bar.service';
import { SplashScreenService } from './services/splash-screen/splash-screen.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CustomStorage } from './stores/custom-storage';
import { STORAGE_ENGINE } from '@ngxs/storage-plugin';

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
    { provide: StatusBarService, useClass: StatusBar },
    { provide: SplashScreenService, useClass: SplashScreen },
    { provide : HttpService , useClass : HTTP},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
