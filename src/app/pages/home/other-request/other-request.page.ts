import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ApprovalState } from 'src/app/stores/approval.state';

@Component({
  selector: 'app-other-request',
  templateUrl: './other-request.page.html',
  styleUrls: ['./other-request.page.scss'],
})
export class OtherRequestPage implements OnInit {

  otherRequest$: Observable<any[]>;
  getLoading$: Observable<boolean>;
  sortObj = {label: "traveldate", state: "rotated", property: "traveldate"};

  constructor(
    private store : Store,
    public location : Location
  ) { }

  ngOnInit() {
    this.otherRequest$ = this.store.select(ApprovalState.getOtherRequest);
    this.getLoading$ = this.store.select(ApprovalState.getLoading);
  }

  back() {
    this.location.back();
  }

  getOther(id : string,type : string) {
    console.log(id,type);
  }

}
