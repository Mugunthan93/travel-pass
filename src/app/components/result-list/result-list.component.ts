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
  @Input() flightState : boolean;
  @Output() getFlightState : EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() getFlightValue : EventEmitter<any> = new EventEmitter<any>(null);

  constructor() { }

  ngOnInit() {
  }

  panelOpen(){
    this.flightState = !this.flightState;
    this.getFlightState.emit(this.flightState);
  }

  getFlight(flight : any){
    if(this.flightState){
      this.getFlightValue.emit(flight);
    }
    else if(!this.flightState){
      this.getFlightValue.emit(null);
    }
  }

}
