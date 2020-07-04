import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, QueryList, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { matExpansionAnimations, MatExpansionPanel } from '@angular/material/expansion';
import { ModalController } from '@ionic/angular';
import { FlightBaggageComponent } from '../flight-baggage/flight-baggage.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { flightData } from 'src/app/models/search/flight';
import { resultObj, fareRule, FlightResultState, AddEmailDetail, RemoveEmailDetail } from 'src/app/stores/result/flight.state';
import { FairRuleComponent } from '../fair-rule/fair-rule.component';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ResultState } from 'src/app/stores/result.state';

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
export class ResultListComponent implements OnInit, AfterViewInit {
  
  @ViewChildren('colref', { read: ElementRef }) columns: QueryList<ElementRef>;
  @Output() getsColumns: EventEmitter<QueryList<ElementRef>> = new EventEmitter<QueryList<ElementRef>>(true);

  @Input() flightList: resultObj[];
  @Input() selectedFlights: any;
  
  @Output() getFlightValue: EventEmitter<any> = new EventEmitter<any>(null);

  selectedFlight = null;
  flightHeight: any;
  itemList: number = 60;
  state: string[] = [];

  type: string;
  flightName: boolean;
  flightPrice: boolean;
  flightMail: boolean;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) {
  }

  ngOnInit() {
    this.type = this.store.selectSnapshot(ResultState.getResultType);
    this.changeType();
    this.flightList.forEach(
      (el, ind, arr) => {
        this.state[ind] = "default";
      }
    );
  }

  ngAfterViewInit(): void {
    this.getsColumns.emit(this.columns);
  }

  rotate(index: number) : void {
    if (this.state[index] == 'default') {
      this.state[index] = 'rotated'
    }
    else if (this.state[index] == 'rotated') {
      this.state[index] = 'default'
    }
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
    
  }

}
