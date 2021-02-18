import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoundTripPage } from './round-trip.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { FairSummaryComponent } from 'src/app/components/flight/fair-summary/fair-summary.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoundTripPage', () => {
  let component: RoundTripPage;
  let fixture: ComponentFixture<RoundTripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RoundTripPage,
        FairSummaryComponent
      ],
      imports: [
        IonicModule.forRoot(),
        MatExpansionModule,
        ReactiveFormsModule,
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
