import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { HotelSearchState } from 'src/app/stores/search/hotel.state';
import { SearchState } from 'src/app/stores/search.state';
import { EligibilityState } from 'src/app/stores/eligibility.state';
import { map } from 'rxjs/operators';
import { UserState } from 'src/app/stores/user.state';

@Component({
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styleUrls: ['./eligibility.component.scss'],
})
export class EligibilityComponent implements OnInit {

  approver: Observable<string>;
  grade: Observable<string>;
  mode: Observable<string>;

  domesticLimit: Observable<string>;
  internationalLimit: Observable<string>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {

    this.approver = this.store.select(UserState.getApproverName);
    this.grade = this.store.select(UserState.getGrade);

    this.mode = this.store.select(SearchState.getSearchMode);
    this.domesticLimit = combineLatest(this.mode, this.store.select(EligibilityState.getDomestic))
      .pipe(
        map(
          (el) => {
            switch (el[0])
            {
              case 'flight': return el[1].flight;
              case 'hotel': return el[1].hotel;
              case 'bus': return el[1].bus;
              case 'train': return el[1].train;
              default: return;
            }
          }
        )
    );
    this.internationalLimit = combineLatest(this.mode, this.store.select(EligibilityState.getInternational))
      .pipe(
        map(
          (el) => {
            switch (el[0]) {
              case 'flight': return el[1].flight;
              case 'hotel': return el[1].hotel;
              case 'bus': return el[1].bus;
              case 'train': return el[1].train;
              default: return;
            }
          }
        )
      );
  }

}
