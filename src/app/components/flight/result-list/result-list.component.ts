import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, QueryList, ElementRef, ViewChildren, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { matExpansionAnimations, MatExpansionPanel } from '@angular/material/expansion';
import { IonContent, ModalController } from '@ionic/angular';
import { FlightBaggageComponent } from '../flight-baggage/flight-baggage.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { flightData } from 'src/app/models/search/flight';
import { resultObj, fareRule, FlightResultState, AddEmailDetail, RemoveEmailDetail, itinerarytrip } from 'src/app/stores/result/flight.state';
import { FairRuleComponent } from '../fair-rule/fair-rule.component';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { ResultState } from 'src/app/stores/result.state';
import { map, flatMap, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash';
import { FlightDetailsComponent } from '../flight-details/flight-details.component';
import { sortButton, SortState } from 'src/app/stores/result/sort.state';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
  animations: [
    matExpansionAnimations.bodyExpansion,
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('rotated => default', animate('225ms ease-out')),
      transition('default => rotated', animate('225ms ease-in'))
    ])
  ]
})
export class ResultListComponent implements OnInit {

  @ViewChild('panelcontent',{static : true}) content : IonContent;

  flightType: Observable<string>;

  @Input() flightList: resultObj[];
  @Input() selectedFlights: any;

  @Output() getFlightValue: EventEmitter<any> = new EventEmitter<any>(null);

  selectedFlight = null;
  state: string[] = [];

  type: string;
  flightName: boolean;
  flightPrice: boolean;
  flightMail: boolean;
  itiMail: Observable<itinerarytrip[]>;

  sortBy$: Observable<sortButton>;

  currentlimit : number = 10;
  currentproperty : string = null;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) {
  }



  ngOnInit() {

    this.type = this.store.selectSnapshot(ResultState.getResultType);
    this.itiMail = this.store.select(FlightResultState.getItinerary);
    this.flightType = this.store.select(FlightResultState.getFlightType);

    this.sortBy$ = this.flightType
      .pipe(
        flatMap(
          (type : string) => {
            if (type == 'departure') {
              return this.store.select(SortState.getDepartureSortBy);
            }
            else if (type == 'return') {
              return this.store.select(SortState.getReturnSortBy);
            }
            return this.store.select(SortState.getFlightSortBy);
          }
        )
      )

    this.changeType();
    if(this.flightList) {
      this.flightList.forEach(
        (...el) => {
          this.state[el[1]] = "default";
        }
      );
    }

    console.log(this.flightList);
    this.sortBy$.subscribe((el) => {
      if(this.currentproperty !== el.property) {
        this.currentlimit = 10;
        this.currentproperty = el.property;
        this.content.scrollToTop(1000);
      }
      else {
        this.currentproperty = el.property;
      }
    });

  }

  rotate(index: number) : void {
    if (this.state[index] == 'default') {
      this.state[index] = 'rotated'
    }
    else if (this.state[index] == 'rotated') {
      this.state[index] = 'default'
    }
  }

  loadData(evt) {
    console.log(evt);
    setTimeout(
      () => {
        if(this.flightList.length < this.currentlimit) {
          evt.target.disabled = true;
        }
        else {
          this.currentlimit += 10;
          (evt.target as any).complete();
        }
      },2000
    );
  }

  changeType(): void {
    if (this.type == 'one-way' || this.type == 'animated-round-trip') {
      this.flightName = false;
      this.flightPrice = true;
      this.flightMail = true;
    }
    else if (this.type == 'round-trip' || this.type == 'multi-city') {
      this.flightName = true;
      this.flightPrice = false;
      this.flightMail = false;
    }
  }

  selectFlight(panel: MatExpansionPanel, flight: any, evt: Event) {

    if ((evt.target as HTMLElement).classList.contains('panel-button')) {
      panel.expanded ? panel.open() : panel.close();
    }
    else {
      panel.expanded ? panel.close() : panel.open();

      if (!(evt.target as HTMLElement).classList.contains('email')) {
        if (this.selectedFlights == null) {

          this.selectedFlights = flight;
          this.getFlightValue.emit(flight);

        }
        else if (this.selectedFlights !== null) {

          if (this.selectedFlights == flight) {
            this.selectedFlights = null;
            this.getFlightValue.emit(null);
          }
          else if (this.selectedFlights !== flight) {

            this.selectedFlights = flight;
            this.getFlightValue.emit(flight);
          }
        }
      }
    }

  }

  getFlight(evt : CustomEvent) {
    if (evt.detail.checked) {
      this.store.dispatch(new AddEmailDetail(evt.detail.value));
    }
    else if (!evt.detail.checked) {
      this.store.dispatch(new RemoveEmailDetail(evt.detail.value));
    }
  }

  emailSelect(mail : itinerarytrip) : Observable<boolean> {
    return this.itiMail.pipe(
      map(
        (email: itinerarytrip[]) => {
          return email.some(el => _.isEqual(mail,el))
        }
      )
    )
  }

  async showBaggage(baggage: flightData[][]){
    const modal = await this.modalCtrl.create({
      component: FlightBaggageComponent,
      componentProps: {
        'baggage': baggage
      },
      cssClass:'baggage'
    });

    return await modal.present();
  }

  async showFareRule(fareRule: fareRule) {
    const modal = await this.modalCtrl.create({
      component: FairRuleComponent,
      componentProps: {
        'fareRule': fareRule
      },
      cssClass:'fareRule'
    });

    return await modal.present();
  }

  async showFlightDetail(connectingFlights: flightData[][]) {
    const modal = await this.modalCtrl.create({
      component: FlightDetailsComponent,
      componentProps: {
        'connecting': connectingFlights
      },
      cssClass: 'baggage'
    });

    return await modal.present();
  }

}
