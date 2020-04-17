import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Environment } from '@ionic-native/google-maps/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  constructor(
    public platform : Platform
  ) {
  }

  async ngOnInit() {
    await this.platform.ready();
  }

  ngOnDestroy() {
    
  }


}

