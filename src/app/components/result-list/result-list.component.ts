import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { flightList } from 'src/app/pages/home/result/flight/one-way/one-way.page';
import { MatExpansionPanelHeader, matExpansionAnimations } from '@angular/material/expansion';
import { ModalController } from '@ionic/angular';
import { FlightBaggageComponent } from '../flight-baggage/flight-baggage.component';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
  animations : [matExpansionAnimations.bodyExpansion]
})
export class ResultListComponent implements OnInit,OnChanges {

  @Input() flightList : flightList[];
  @Input() selectedFlights : any;
  @Output() getFlightValue: EventEmitter<any> = new EventEmitter<any>(null);
  
  selectedFlight = null;
  flightHeight : any;
  constructor(
    public modalCtrl : ModalController
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit() {
    console.log(this.selectedFlights);
    this.flightList.forEach(
      (el) => {
        this.flightHeight = el.item.length*60+"px"
    });
  }

  selectFlight(panel : MatExpansionPanelHeader, flight: any, evt: Event) {
    
    if (!this._isExpansionIndicator(evt.target)) {

      evt.stopPropagation();

      if (!this._isExpansionIndicator(evt.target)) {

        evt.stopPropagation();
  
        if (this.selectedFlights == null) {
  
          this.selectedFlights = flight;
          this.getFlightValue.emit(flight);
  
        }
        else if (this.selectedFlights !== null) {
  
          if(this.selectedFlights == flight){
            this.selectedFlights = null;
            this.getFlightValue.emit(null);
          }
          else if(this.selectedFlights !== flight){
  
            this.selectedFlights = flight;
            this.getFlightValue.emit(flight);
          }
        }
  
      }

    }

  }

  private _isExpansionIndicator(target : EventTarget) : boolean {
    const expansionIndicatorClass = 'expandcol';
    return ((target as HTMLElement).classList && (target as HTMLElement).classList.contains(expansionIndicatorClass) );
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
