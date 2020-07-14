import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { IonTabs, NavController, IonTabButton, IonTabBar } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { JourneyType, FlightSearchState } from 'src/app/stores/search/flight.state';
import { SearchType } from 'src/app/stores/search.state';
import { RouterNavigation, Navigate } from '@ngxs/router-plugin';
import { RouterStateSnapshot, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { RouterTrigger } from '@ngxs/router-plugin/src/router.state';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.page.html',
  styleUrls: ['./flight.page.scss'],
  providers : [IonTabs]
})
export class FlightPage implements OnInit {

  flightType: string;
  journeyType$: Observable<number>;

  constructor(
    public store: Store,
    public activatedRoute : ActivatedRoute
  ) {
    this.journeyType$ = this.store.select(FlightSearchState.getJourneyType);
  }
  
  async ngOnInit() {
  }

  typeChange(evt : CustomEvent) {
    console.log(evt, this.activatedRoute);
    this.store.dispatch(new JourneyType(evt.detail.value));
    this.store.dispatch(new SearchType(evt.detail.value));
    this.store.dispatch(new Navigate(['/','home','search','flight',evt.detail.value]));
  }

}
