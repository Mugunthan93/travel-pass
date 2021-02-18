import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoundTripPage } from './round-trip.page';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoundTripPageRoutingModule } from '../../../result/flight/round-trip/round-trip-routing.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoundTripPage', () => {
  let component: RoundTripPage;
  let fixture: ComponentFixture<RoundTripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RoundTripPage,
        ResultSortingComponent,
        ResultListComponent
      ],
      imports: [
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        MatExpansionModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoundTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
