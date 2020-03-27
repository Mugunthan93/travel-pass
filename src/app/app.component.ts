import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  resizeSub: Subscription;
  width: number;
  height: number;

  constructor(
    public platform: Platform,
    public screenOrientation: ScreenOrientation
  ) {
  }

  ngOnInit() {
    
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.platform.ready().then(
      () => {


        this.width = this.platform.width();
        this.height = this.platform.height();
        console.log(this.width,this.height);
        this.resizeSub = this.platform.resize.subscribe(
          () => {
            this.width = this.platform.width();
            this.height = this.platform.height();
            console.log(this.width,this.height);
          }
        );


      }
    );
  }

  ngOnDestroy() {
    if(this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }


}

