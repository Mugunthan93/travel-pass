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
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { ApproveRequestComponent } from './components/shared/approve-request/approve-request.component';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { MatExpansionModule } from '@angular/material/expansion';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { RescheduleComponent } from './components/shared/reschedule/reschedule.component';
import { CancellationComponent } from './components/shared/cancellation/cancellation.component';
import { SelectModalComponent } from './components/shared/select-modal/select-modal.component';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { InventoryRoomsComponent } from './components/hotel/inventory-rooms/inventory-rooms.component';
import { UserIdleModule } from 'angular-user-idle';

@NgModule({
  declarations: [
    AppComponent,
    ApproveRequestComponent,
    RescheduleComponent,
    CancellationComponent,
    SelectModalComponent,
    InventoryRoomsComponent
  ],
  entryComponents: [
    ApproveRequestComponent,
    RescheduleComponent,
    CancellationComponent,
    SelectModalComponent,
    InventoryRoomsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: "md",
      scrollPadding: false,
      scrollAssist: false,
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    StateModule,
    UserIdleModule.forRoot({
      // idle: 600,
      // timeout: 300,
      // ping: 120

      idle : 540,
      timeout : 60,
      ping : 10
    })
  ],
  providers: [
    Platform,
    FilePath,
    File,
    FileTransfer,
    FileChooser,
    FileOpener,
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    AndroidFullScreen,
    HTTP,
    Keyboard,
    WebView,
    {
      provide: NativeHttpService,
      useFactory: (platform: Platform, http: HTTP) => {
        return new NativeHttpService(platform, http);
      },
      deps: [Platform, HTTP],
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
