import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
  })
  export class PlatformService {
  
    constructor(
      public platform: Platform
    ) {
    }
  }