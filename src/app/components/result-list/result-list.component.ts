import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { flightList } from 'src/app/pages/home/result/flight/one-way/one-way.page';
import { MatExpansionPanelHeader, matExpansionAnimations } from '@angular/material/expansion';
import { CdkAccordion } from '@angular/cdk/accordion';

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

  constructor(
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit() {
    console.log(this.selectedFlights);
  }

  selectFlight(panel : MatExpansionPanelHeader, flight: any, evt: Event) {
    
    if (!this._isExpansionIndicator(evt.target)) {

      evt.stopPropagation();

      if (this.selectedFlight == null) {

        this.selectedFlight = flight;
        this.getFlightValue.emit(flight);

      }
      else if (this.selectedFlight !== null) {

        if(this.selectedFlight == flight){
          return;
        }
        else if(this.selectedFlight !== flight){
          this.selectedFlight = flight;

          this.getFlightValue.emit(flight);
        }
      }

    }

  }

  private _isExpansionIndicator(target : EventTarget) : boolean {
    const expansionIndicatorClass = 'expandcol';
    return ((target as HTMLElement).classList && (target as HTMLElement).classList.contains(expansionIndicatorClass) );
  }

}
