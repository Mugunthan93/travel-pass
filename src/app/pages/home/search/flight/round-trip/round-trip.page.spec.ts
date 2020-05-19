import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoundTripPage } from './round-trip.page';
import { ReactiveFormsModule } from '@angular/forms';

describe('RoundTripPage', () => {
  let component: RoundTripPage;
  let fixture: ComponentFixture<RoundTripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundTripPage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule
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
