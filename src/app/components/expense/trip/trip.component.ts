import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertOptions } from '@ionic/core';
import { Observable } from 'rxjs';
import { projectList, DashboardState, trippayload, AddNewTrip } from 'src/app/stores/dashboard.state';
import { Store } from '@ngxs/store';
import { CompanyState } from 'src/app/stores/company.state';
import { user } from 'src/app/models/user';
import { DateMatchValidator } from 'src/app/validator/date_match.validators';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { UserState } from 'src/app/stores/user.state';

@Component({
  selector: "app-trip",
  templateUrl: "./trip.component.html",
  styleUrls: ["./trip.component.scss"],
})
export class TripComponent implements OnInit {
  tripForm: FormGroup;
  customAlertOptions: AlertOptions;
  projectName$: Observable<projectList[]>;
  manager$: Observable<user[]>;
  userId: number;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) {}

  ngOnInit() {
    this.userId = this.store.selectSnapshot(UserState.getUserId);
    this.tripForm = new FormGroup({
      trip_name: new FormControl(null, [Validators.required]),
      project_name: new FormControl(null, [Validators.required]),
      claim_type: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
      end_date: new FormControl(null, [
        Validators.required
      ]),
      select_manager: new FormControl(null, [Validators.required]),
    });

    this.customAlertOptions = {
      cssClass: "cabinClass",
    };

    this.projectName$ = this.store.select(DashboardState.getProjectList);
    this.manager$ = this.store.select(CompanyState.getManagerList);

    this.tripForm
      .get("end_date")
      .setValidators(DateMatchValidator("start_date", "end_date"));
  }

  addTrip() {
    if (this.tripForm.valid) {
      let payload: trippayload = {
        e_flag: 0,
        endCity: "",
        endDate: moment(this.tripForm.value.end_date).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        manager_approval: 0,
        manager_id: (this.tripForm.value.select_manager as user).id,
        project_id: (this.tripForm.value.project_name as projectList).id,
        startCity: "",
        startDate: moment(this.tripForm.value.start_date).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        status: "new",
        travelled_by: this.userId,
        trip_name: this.tripForm.value.trip_name,
      };

      this.store.dispatch(new AddNewTrip(payload));
      
    }
  }

  changeProjectName(evt: CustomEvent) {
    this.tripForm.controls["project_name"].patchValue(evt.detail.value);
  }

  changeClaimType(evt: CustomEvent) {
    this.tripForm.controls["claim_type"].patchValue(evt.detail.value);
  }

  changeManager(evt: CustomEvent) {
    this.tripForm.controls["select_manager"].patchValue(evt.detail.value);
  }

  dismiss() {
    this.modalCtrl.dismiss(null,null,'trip');
  }
}
