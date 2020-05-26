import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateBranch } from 'src/app/stores/branch.state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit,OnDestroy {

  @Output() closeBranch = new EventEmitter<boolean>();

  branchForm: FormGroup;
  branchSub: Subscription;

  constructor(
    private store:Store
  ) { }

  ngOnInit() {
    this.branchForm = new FormGroup({
      name : new FormControl(),
      address : new FormControl(),
      gst_number : new FormControl(),
      mobile_number : new FormControl()
    });
  }

  addBranch() {
    this.branchSub = this.store.dispatch(new CreateBranch(this.branchForm.value))
      .subscribe(
        (success) => {
          if (success) {
            this.closeBranch.emit(false);
          }
        }
      );
  }

  closebranch() {
    this.closeBranch.emit(false);
  }

  ngOnDestroy() {
    if (this.branchSub) {
      this.branchSub.unsubscribe();
    }
  }

}
