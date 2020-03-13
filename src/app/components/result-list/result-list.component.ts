import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { flightList } from 'src/app/pages/home/result/flight/one-way/one-way.page';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
})
export class ResultListComponent implements OnInit {

  @ViewChild('panel',{static : true}) panel : MatExpansionPanel;

  @Input() flightList : flightList[];
  @Output() getFlightValue: EventEmitter<any> = new EventEmitter<any>(null);
  
  selectedFlight = null;

  constructor() { }

  ngOnInit() {
  }

  selectFlight(panel: MatExpansionPanel, flight: any, evt: Event) {
    
    if (this._isExpansionIndicator(evt.target)) {
      panel.toggle();
    }
    else if (!this._isExpansionIndicator(evt.target)) {
      if (this.selectedFlight == null) {
        this.selectedFlight = flight;
        this.getFlightValue.emit(flight);
      }
      else if (this.selectedFlight !== null) {
        this.selectedFlight = null;
        this.getFlightValue.emit(null);
      }
      panel.toggle();
    }

  }

  private _isExpansionIndicator(target : EventTarget) : boolean {
    const expansionIndicatorClass = 'expandcol';
    return ((target as HTMLElement).classList && (target as HTMLElement).classList.contains(expansionIndicatorClass) );
  }

  expandPanel(panel : MatExpansionPanel){
    panel.toggle();
  }

}
