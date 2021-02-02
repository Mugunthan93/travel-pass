import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookState, BookBack, GetSendRequest } from 'src/app/stores/book.state';
import { Observable } from 'rxjs';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';
import { UserState } from 'src/app/stores/user.state';
import { HotelResultState, inventory } from 'src/app/stores/result/hotel.state';

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
  isAdmin$: Observable<boolean>;
  invrooms$: Observable<inventory[]>;

  constructor(
    private store: Store
  ) {
   }

  ngOnInit() {

    this.bookMode$ = this.store.select(BookState.getBookMode);
    this.bookType$ = this.store.select(BookState.getBookType);

    this.bookMode = this.store.selectSnapshot(BookState.getBookMode);
    this.bookType = this.store.selectSnapshot(BookState.getBookType);

    this.isAdmin$ = this.store.select(UserState.isAdmin);
    this.invrooms$ = this.store.select(HotelResultState.getSelectedInventoryRooms);
  }

  back() {
    this.store.dispatch(new BookBack());
  }

  async confirmRequest(str : string) {
    this.store.dispatch(new GetSendRequest(BookConfirmationComponent,str));
  }

}
