import { Component, OnInit } from '@angular/core';
import { resultObj, FlightResultState, roundtripResult } from 'src/app/stores/result/flight.state';
import { Observable, Subscription } from 'rxjs';
import { ResultState } from 'src/app/stores/result.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {

  constructor(
    private store : Store
  ) { }

  selectedFlight: any = null;

  flightList: resultObj[];
  flightList$: Observable<roundtripResult>;
  flightListSub: Subscription;

  resultType: string;
  resultType$: Observable<string>;
  resultTypeSub: Subscription;

  ngOnInit() {

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (result: string) => {
        this.resultType = result;
        console.log(this.resultType);
      }
    );

    this.flightList$ = this.store.select(FlightResultState.getRoundTrip);
    this.flightListSub = this.flightList$.subscribe(
      (res: roundtripResult) => {
        console.log(res);
        this.flightList = res.value;
      }
    );
  }

  currentFlight(evt) {
    
  }

}
