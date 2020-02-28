import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWaySearch : FormGroup

  constructor(
    public modalCtrl : ModalController
  ) {
   }

  ngOnInit(){
    this.oneWaySearch = new FormGroup({});
  }

  async selectCity(){
      return await this.modalCtrl.create({
        component: CityModalComponent
      }).then(
        (modalEl) => {
          modalEl.present();
          modalEl.onDidDismiss()
          .then(
            (selectedCity) => {
              console.log(selectedCity);
            }
          );
        }
      );
  }

}
