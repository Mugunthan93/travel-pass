import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { ResultState } from 'src/app/stores/result.state';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss']
})
export class RoundTripPage implements OnInit {

  resultType: string;
  resultType$: Observable<string>;
  resultTypeSub: Subscription;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store : Store
  ) {
  }
  
  ngOnInit() {

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (type: string) => {
        this.resultType = type;
        console.log(this.resultType);
      }
    );

  }

  book() {
    this.router.navigate(['/', 'home', 'book', 'flight', 'round-trip']);
  }
}
