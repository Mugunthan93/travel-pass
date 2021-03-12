import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { BookState } from 'src/app/stores/book.state';
import { PassengerState } from 'src/app/stores/passenger.state';
import { FlightPassengerState } from 'src/app/stores/passenger/flight.passenger.states';
import { ResultState } from 'src/app/stores/result.state';
import { FlightResultState } from 'src/app/stores/result/flight.state';
import { DomesticResultState } from 'src/app/stores/result/flight/domestic.state';
import { SearchState } from 'src/app/stores/search.state';

export interface processdetail {
  source : string,
  destination : string
  // "process" | "wait" | "complete" | "error"
  status : string
  errorMsg : string
}

@Component({
  selector: 'app-book-process',
  templateUrl: './book-process.component.html',
  styleUrls: ['./book-process.component.scss'],
})
export class BookProcessComponent implements OnInit {

  @Input() segments : processdetail[];
  @Input() departure : boolean;
  @Input() ret : boolean;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    console.log(this.segments);
  }

  success() {
    return  this.segments.map(el => el.status).some(el => el == "complete");
  }

  failed() {
    return this.segments.map(el => el.status).some(el => el == "error");
  }

  ok() {
    this.modalCtrl.dismiss(null,null,'book-process');
    this.store.dispatch(new Navigate(['/','home','dashboard','home-tab']));
    this.store.dispatch(new StateReset(SearchState,ResultState,FlightResultState,DomesticResultState,BookState,PassengerState,FlightPassengerState));
  }

}
