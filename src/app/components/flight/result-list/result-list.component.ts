import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { flightList } from 'src/app/pages/home/result/flight/one-way/one-way.page';
import { MatExpansionPanelHeader, matExpansionAnimations, MatExpansionPanel } from '@angular/material/expansion';
import { ModalController } from '@ionic/angular';
import { FlightBaggageComponent } from '../flight-baggage/flight-baggage.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  ],
})
export class ResultListComponent implements OnInit,OnChanges {

  @Input() flightList : flightList[];
  @Input() selectedFlights : any;
  @Output() getFlightValue: EventEmitter<any> = new EventEmitter<any>(null);

  rotate(item: flightList) {
    console.log(item);
    if (item.state == 'default') {
      item.state = 'rotated'
    }
    else if (item.state == 'rotated') {
      item.state = 'default'
    }
  }
  
  selectedFlight = null;
  flightHeight: any;
  itemList: number = 60;
  constructor(
    public modalCtrl : ModalController
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit() {
    console.log(this.flightList);
  }

  selectFlight(panel: MatExpansionPanel, flight: any, evt: Event) {
    
    if ((evt.target as HTMLElement).classList.contains('panel-button')) {
      panel.expanded ? panel.open() : panel.close();
    }
    else {
      panel.expanded ? panel.close() : panel.open();
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

  async showBaggage(flight){
    const modal = await this.modalCtrl.create({
      component: FlightBaggageComponent,
      componentProps: {
        list: flight
      },
      cssClass:'baggage'
    });

    return await modal.present();
  }

}
