import { Component, OnInit, OnDestroy } from '@angular/core';
import { company } from 'src/app/models/company';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { BranchState } from 'src/app/stores/branch.state';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
})
export class BranchListComponent implements OnInit,OnDestroy {

  branches$: Observable<company[]>;
  branches: any[] = [];

  branchSub: Subscription;

  constructor(
    private store: Store
  ) {
    console.log(this.branches);
   }

  ngOnInit() {
    this.branches$ = this.store.select(BranchState.branches);
    this.branchSub = this.branches$.subscribe(
      (branches: any[]) => {
        console.log(branches);
        this.branches = [];
        this.branches = branches;
      });
  }

  editBranch(branch : company) {
    
  }

  ngOnDestroy() {
    if (this.branchSub) {
      this.branchSub.unsubscribe();
    }
  }



}
