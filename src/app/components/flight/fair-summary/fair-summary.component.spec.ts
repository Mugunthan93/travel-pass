import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FairSummaryComponent } from './fair-summary.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('FairSummaryComponent', () => {
  let component: FairSummaryComponent;
  let fixture: ComponentFixture<FairSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FairSummaryComponent ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FairSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
