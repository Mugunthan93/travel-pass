import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookState } from 'src/app/stores/book.state';
import { Observable } from 'rxjs';
import { StateReset } from 'ngxs-reset-plugin';
import { OneWayBookState } from 'src/app/stores/book/flight/oneway.state';
import { DomesticBookState } from 'src/app/stores/book/flight/domestic.state';
import { InternationalBookState } from 'src/app/stores/book/flight/international.state';
import { MultiCityBookState } from 'src/app/stores/book/flight/multi-city.state';
import { Navigate } from '@ngxs/router-plugin';
import { FLightBookState } from 'src/app/stores/book/flight.state';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  bookMode$: Observable<string>;
  bookType$: Observable<string>;

  bookMode: string;
  bookType: string;

  constructor(
    private store : Store
  ) {
   }

  ngOnInit() {

    this.bookMode$ = this.store.select(BookState.getBookMode);
    this.bookType$ = this.store.select(BookState.getBookType);

    this.bookMode = this.store.selectSnapshot(BookState.getBookMode);
    this.bookType = this.store.selectSnapshot(BookState.getBookType)
  }

  back() {
    this.store.dispatch(new StateReset(BookState));
    this.store.dispatch(new Navigate(['/', 'home', 'result', this.bookMode, this.bookType]));
  }

}
