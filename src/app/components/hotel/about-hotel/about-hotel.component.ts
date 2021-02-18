import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as decode from 'decode-html';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { selectedHotel, HotelResultState } from 'src/app/stores/result/hotel.state';
import { Store } from '@ngxs/store';
import { HotelBookState, blockedRoom } from 'src/app/stores/book/hotel.state';

@Component({
  selector: 'app-about-hotel',
  templateUrl: './about-hotel.component.html',
  styleUrls: ['./about-hotel.component.scss'],
})
export class AboutHotelComponent implements OnInit {

  @Input() selectedSegement: string;
  hotel$: Observable<selectedHotel>;
  blockedroom$: Observable<blockedRoom>;

  constructor(
    private store : Store,
    public modalCtrl: ModalController,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    
    this.hotel$ = this.store.select(HotelResultState.getSelectedHotel);
    this.blockedroom$ = this.store.select(HotelBookState.getBlockedRoom);
  }
  
  tabChange(evt : CustomEvent) {
    this.selectedSegement = evt.detail.value;
  }

  back() {
    this.modalCtrl.dismiss(null, null,'about-hotel');
  }

  decodeDescritption(desc: string) {
    const descTemplate = decode(desc);
    const sanitizedTemplate = this.domSanitizer.sanitize(SecurityContext.HTML, descTemplate);
    return sanitizedTemplate;
  }

}
