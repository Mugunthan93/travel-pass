import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { user } from 'src/app/models/user';
import { Store } from '@ngxs/store';
import { UserState } from 'src/app/stores/user.state';
import { company } from 'src/app/models/company';
import { BranchState } from 'src/app/stores/branch.state';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  branches$: Observable<company[]>;
  branches: any[] = [];
  users: any[] = [];

  branchSub: Subscription;

  constructor(
    private store: Store
  ) {
    console.log(this.users);
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

  branchChange(evt : any) {
    console.log(evt);
  }
      
  editUser(user: user) {
    
  }

  ngOnDestroy() {
    if (this.branchSub) {
      this.branchSub.unsubscribe();
    }
  }

}
