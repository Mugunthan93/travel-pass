import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, QueryList, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { matExpansionAnimations, MatExpansionPanel } from '@angular/material/expansion';
import { ModalController } from '@ionic/angular';
import { FlightBaggageComponent } from '../flight-baggage/flight-baggage.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { flightData } from 'src/app/models/search/flight';
import { resultObj, fareRule } from 'src/app/stores/result/flight.state';

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
export class ResultListComponent implements OnInit, OnChanges, AfterViewInit {
  
  @ViewChildren('colref', { read: ElementRef }) columns: QueryList<ElementRef>;
  @Output() getsColumns: EventEmitter<QueryList<ElementRef>> = new EventEmitter<QueryList<ElementRef>>(true);
  @Input() flightType: string;

  @Input() type: string;
  @Input() flightList: resultObj[];
  @Input() selectedFlights: any;
  @Output() getFlightValue: EventEmitter<any> = new EventEmitter<any>(null);
  
  currentList: resultObj[];
  selectedFlight = null;
  flightHeight: any;
  itemList: number = 60;
  state: string[] = [];

  constructor(
    public modalCtrl : ModalController
  ) {
  }

  ngOnInit() {
    this.currentList = this.flightList;
    this.currentList.forEach(
      (el, ind, arr) => {
        this.state[ind] = "default";
      }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }

  ngAfterViewInit(): void {
    this.getsColumns.emit(this.columns);
  }

  rotate(index: number) {
    if (this.state[index] == 'default') {
      this.state[index] = 'rotated'
    }
    else if (this.state[index] == 'rotated') {
      this.state[index] = 'default'
    }
  }

  selectFlight(panel: MatExpansionPanel, flight: any, evt: Event) {
    
    console.log((evt.target as HTMLElement).classList);

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

  showFareRule(fareRule: fareRule) {
    
  }

  async showFlightDetail(connectingFlights: flightData[][]) {
    
  }

}
