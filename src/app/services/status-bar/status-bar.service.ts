import { Injectable } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Injectable({
  providedIn: 'root'
})
export class StatusBarService {

  constructor(
    public statusBar : StatusBar
  ) { 
  }
}
