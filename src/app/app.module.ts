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
import { ApproveRequestComponent } from './components/flight/approve-request/approve-request.component';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { MatExpansionModule } from '@angular/material/expansion';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@NgModule({
  declarations: [
    AppComponent,
    ApproveRequestComponent
  ],
  entryComponents: [
    ApproveRequestComponent
  ],
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
    MatExpansionModule,
    StateModule
  ],
  providers: [
    Platform,
    FilePath,
    File,
    FileTransfer,
    FileOpener,
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    Network,
    AndroidFullScreen,
    HTTP,
    Keyboard,
    Deeplinks,
    WebView,
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
