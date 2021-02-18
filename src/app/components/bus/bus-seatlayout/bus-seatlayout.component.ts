import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { BusResultState, busResponse, seat, SelectedUpperSeat, SelectedLowerSeat } from 'src/app/stores/result/bus.state';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-bus-seatlayout',
  templateUrl: './bus-seatlayout.component.html',
  styleUrls: ['./bus-seatlayout.component.scss']
})
export class BusSeatlayoutComponent implements OnInit {

  $lowerSeat: Observable<seat[][]>;
  $upperSeat: Observable<seat[][]>;
  $busDetail: Observable<busResponse>;
  $selectedSeat: Observable<seat[]>;

  $seatIndex: BehaviorSubject<string> = new BehaviorSubject('lower');

  constructor(
    private store : Store
  ) {
    
  }
  
  ngOnInit() {

    this.$lowerSeat = this.store.select(BusResultState.getLowerSeat);
    this.$upperSeat = this.store.select(BusResultState.getUpperSeat);
    this.$busDetail = this.store.select(BusResultState.getCurrentBus);
    this.$selectedSeat = this.store.select(BusResultState.getselectedSeat);

  }

  changeIndex(evt: CustomEvent) {
    this.$seatIndex.next(evt.detail.value);
  }

  selectLowerSeat(seat: seat) {
    this.store.dispatch(new SelectedLowerSeat(seat));
  }
  
  selectUpperSeat(seat: seat) {
    this.store.dispatch(new SelectedUpperSeat(seat));
  }

  seatURL(seat: seat): Observable<string> {
    return of(seat)
      .pipe(
        map(
          (seat) => {
            let url: string = '../../../../assets/icons/bus/bus seats/';
        
            let seater: boolean = seat !== null && seat.length == 1 && seat.width == 1;
            let sleeper: boolean = seat !== null && seat.length == 2 && seat.width == 1
            let verticalsleeper: boolean = seat !== null && seat.length == 1 && seat.width == 2;
        
            let availableseater: boolean = seater && seat.available;
            let availablesleeper: boolean = sleeper && seat.available;
            let availableverticalsleeper: boolean = verticalsleeper && seat.available;
        
            let selectedseater: boolean = seater && seat.selected;
            let selectedsleeper: boolean = sleeper && seat.selected;
            let selectedverticalsleeper: boolean = verticalsleeper && seat.selected;
        
            let bookedseater: boolean = seater && !seat.available;
            let bookedsleeper: boolean = sleeper && !seat.available;
            let bookedverticalsleeper: boolean = verticalsleeper && !seat.available;
        
            if (seat !== null && seat.selected == false) {
              if (availableseater) {
                if (seat.ladiesSeat) {
                  return url + 'pax3.svg';
                }
                else if (!seat.ladiesSeat) {
                  return url + 'pax1.svg';
                }
              }
              else if (availablesleeper) {
                if (seat.ladiesSeat) {
                  return url + 's4.svg';
                }
                else if (!seat.ladiesSeat) {
                  return url + 's5.svg';
                }
              }
              else if (availableverticalsleeper) {
                if (seat.ladiesSeat) {
                  return url + 'sleeper2.svg';
                }
                else if (!seat.ladiesSeat) {
                  return url + 'sleeper4.svg';
                }
              }
              else if (bookedseater) {
                return url + 'pax2.svg';
              }
              else if (bookedsleeper) {
                return url + 's2.svg';
              }
              else if (bookedverticalsleeper) {
                return url + 'sleeper3.svg';
              }
            }
            else if (seat !== null && seat.selected == true) {
              if (selectedseater) {
                return url + 'pax5.svg';
              }
              else if (selectedsleeper) {
                return url + 's1.svg';
              }
              else if (selectedverticalsleeper) {
                return url + 'sleeper2.svg';
              }
            }
          }
        )
      )

  }
}
