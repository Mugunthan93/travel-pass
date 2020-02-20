import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { user } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/stores/app.state';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit, OnDestroy {

  @Select(AppState.getUser) user$ : Observable<user>;

  constructor(){
  }

  ngOnInit(): void {

    this.user$.subscribe(
      (user) => {
        console.log(user);
      }
    );

  }

  ngOnDestroy(): void {
  }

}