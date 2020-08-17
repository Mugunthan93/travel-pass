import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about-hotel',
  templateUrl: './about-hotel.component.html',
  styleUrls: ['./about-hotel.component.scss'],
})
export class AboutHotelComponent implements OnInit {

  @Input() selectedSegement: string;

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    
  }
  
  tabChange(evt : CustomEvent) {
    this.selectedSegement = evt.detail.value;
  }

  back() {
    this.modalCtrl.dismiss(null,null,'about-hotel');
  }

}
