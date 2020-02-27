import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CityModalComponent } from '../city-modal/city-modal.component';
@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss'],
})
export class SelectCityComponent implements OnInit  {

  constructor(
    public cityModalCtrl : ModalController
  ) {
  }
  
  ngOnInit() {
  }

  async cityModal() {
    return await this.cityModalCtrl.create({
      component: CityModalComponent
    }).then(
      (modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss()
          .then(
            (data) => {
              console.log(data);
            }
          );
      }
    );
  }

  selectCity(){
    return this.cityModal();
  }

}
