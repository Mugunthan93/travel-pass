import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, IonInput } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  @ViewChild(IonInput,{static:true,read:IonInput}) input: IonInput;

  constructor(
    public platform: Platform,
    private keyboard : Keyboard
  ) {
  }

  async ngOnInit() {
    await this.platform.ready();
  }

  ionViewDidLoad(){
    this.keyboard.disableScroll(true);
    console.log(this.input);
  }

  ngOnDestroy() {
    
  }


}

