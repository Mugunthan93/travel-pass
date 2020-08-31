import { Component, OnInit, SecurityContext } from '@angular/core';
import { Store } from '@ngxs/store';
import { RoomDetails, HotelBookState, blockedRoom } from 'src/app/stores/book/hotel.state';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import * as decode from 'decode-html';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss'],
})
export class PoliciesComponent implements OnInit {

  roomDetail$: Observable<RoomDetails[]>;
  blockedroom$: Observable<blockedRoom>;

  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    private domSanitizer: DomSanitizer
  ) {
  }
  
  ngOnInit() {
    this.roomDetail$ = this.store.select(HotelBookState.getRoomDetail);
    this.blockedroom$ = this.store.select(HotelBookState.getBlockedRoom);
  }

  cleanpolicy(policy : string) {
    let policy_lines = policy
      .replace("[^A-Za-z0-9]", "")
      .split('|');
    
    let new_policy = '';
    for (let policy of policy_lines) {
      new_policy += policy + '\n';
    }

    return new_policy;
  }

  decodeDescritption(desc: string) {
    const descTemplate = decode(desc);
    const sanitizedTemplate = this.domSanitizer.sanitize(SecurityContext.HTML, descTemplate);
    return sanitizedTemplate;
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null,'hotel-policies');
  }

}
