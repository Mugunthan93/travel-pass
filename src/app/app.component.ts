import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{


  constructor(
    public screenOrientation: ScreenOrientation
  ) {
  }

  ngOnInit() {
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  ngOnDestroy() {
    
  }


}

