import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookState } from 'src/app/stores/book.state';
import { Observable } from 'rxjs';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { LoadingController } from '@ionic/angular';

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
    private store: Store,
    public loadingCtrl : LoadingController
  ) {
   }

  ngOnInit() {

    this.bookMode$ = this.store.select(BookState.getBookMode);
    this.bookType$ = this.store.select(BookState.getBookType);

    this.bookMode = this.store.selectSnapshot(BookState.getBookMode);
    this.bookType = this.store.selectSnapshot(BookState.getBookType)
  }

  async back() {
    this.store.dispatch(new StateReset(BookState));
    if (this.bookType == 'animated-round-trip') {
      this.bookType = 'round-trip';
    }
    if (this.bookMode == 'flight') {
      this.store.dispatch(new Navigate(['/', 'home', 'result', this.bookMode, this.bookType]));
    }
    else {
      this.store.dispatch(new Navigate(['/', 'home', 'result', this.bookMode]));
    }
  }

}
