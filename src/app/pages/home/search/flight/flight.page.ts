import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { JourneyType } from 'src/app/stores/search/flight.state';
import { SearchType } from 'src/app/stores/search.state';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.page.html',
  styleUrls: ['./flight.page.scss'],
  providers : [IonTabs]
})
export class FlightPage implements OnInit {

  flightType: string;
  journeyType$: Observable<string>;

  constructor(
    public store : Store
  ) {

  }
  
  async ngOnInit() {
  }

  typeChange(evt) {
    this.store.dispatch(new JourneyType(evt.tab));
    this.store.dispatch(new SearchType(evt.tab));
  }

}
