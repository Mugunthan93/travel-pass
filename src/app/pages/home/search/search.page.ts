import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { SearchState } from 'src/app/stores/search.state';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchMode$: Observable<any>;
  search: string;
  searchSub: Subscription;

  constructor(
    private store : Store
  ) {
  }

  ngOnInit() {
    this.searchMode$ = this.store.select(SearchState.getSearchMode);
    this.searchSub = this.searchMode$.subscribe(
      (mode : string) => {
        this.search = mode;
      }
    );
  }

  back() {
  }

}
